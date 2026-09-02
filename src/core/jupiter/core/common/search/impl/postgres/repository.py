"""PostgreSQL search index using ``pg_trgm``."""

from collections.abc import Iterable
from typing import Final

from jupiter.core.common.entity_summary import EntitySummary
from jupiter.core.common.search.indexed_entity_name import indexed_entity_name
from jupiter.core.common.search.indexed_location import IndexedLocation
from jupiter.core.common.search.limit import SearchLimit
from jupiter.core.common.search.offset import SearchOffset
from jupiter.core.common.search.query import SearchQuery
from jupiter.core.common.search.repository import (
    SearchMatch,
    SearchMatchesPage,
    SearchRepository,
)
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.entity import AboveGroundEntity
from jupiter.framework.realm.realm import DatabaseRealm, RealmCodecRegistry, RealmThing
from jupiter.framework.storage.postgres.repository import PostgresRepository
from jupiter.framework.storage.repository import EntityNotFoundError
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    MetaData,
    RowMapping,
    String,
    Table,
    delete,
    func,
    insert,
    or_,
    select,
    update,
)
from sqlalchemy.ext.asyncio import AsyncConnection

# Match rows using the pg_trgm ``%`` operator (uses ``pg_trgm.similarity_threshold``).
# Ranking uses ``similarity()`` scores for ordering.
# Deployments should run ``CREATE EXTENSION IF NOT EXISTS pg_trgm`` and add GIN indexes,
# e.g. ``CREATE INDEX ... ON search_index USING gin (name gin_trgm_ops)`` (and ``note``,
# ``location_name``, ``location_address``, ``location_country``, ``location_gps``).


class PostgresSearchRepository(PostgresRepository, SearchRepository):
    """PostgreSQL search repository backed by trigram similarity."""

    _search_index_table: Final[Table]
    _search_index_tag_table: Final[Table]
    _search_index_contact_table: Final[Table]
    _search_index_location_table: Final[Table]
    _search_index_visible_to_table: Final[Table]

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(realm_codec_registry, connection, metadata)
        self._search_index_table = Table(
            "search_index",
            metadata,
            Column(
                "workspace_ref_id",
                Integer,
                ForeignKey("workspace.ref_id"),
                nullable=False,
            ),
            Column(
                "search_domain_ref_id",
                Integer,
                ForeignKey("search_domain.ref_id"),
                nullable=False,
            ),
            Column("entity_tag", String, nullable=False),
            Column("parent_ref_id", Integer, nullable=False),
            Column("ref_id", Integer, nullable=False),
            Column("name", String, nullable=False),
            Column("note", String, nullable=False),
            Column("location_name", String, nullable=False),
            Column("location_address", String, nullable=False),
            Column("location_country", String, nullable=False),
            Column("location_gps", String, nullable=False),
            Column("archived", Boolean, nullable=False),
            Column("created_time", DateTime(timezone=True), nullable=False),
            Column("last_modified_time", DateTime(timezone=True), nullable=False),
            Column("archived_time", DateTime(timezone=True), nullable=True),
            keep_existing=True,
        )
        self._search_index_tag_table = Table(
            "search_index_tag",
            metadata,
            Column(
                "workspace_ref_id",
                Integer,
                nullable=False,
                primary_key=True,
            ),
            Column(
                "search_domain_ref_id",
                Integer,
                ForeignKey("search_domain.ref_id"),
                nullable=False,
            ),
            Column("entity_tag", String, nullable=False, primary_key=True),
            Column("entity_ref_id", Integer, nullable=False, primary_key=True),
            Column("tag_ref_id", Integer, nullable=False, primary_key=True),
            keep_existing=True,
        )
        self._search_index_contact_table = Table(
            "search_index_contact",
            metadata,
            Column(
                "workspace_ref_id",
                Integer,
                nullable=False,
                primary_key=True,
            ),
            Column(
                "search_domain_ref_id",
                Integer,
                ForeignKey("search_domain.ref_id"),
                nullable=False,
            ),
            Column("entity_tag", String, nullable=False, primary_key=True),
            Column("entity_ref_id", Integer, nullable=False, primary_key=True),
            Column("contact_ref_id", Integer, nullable=False, primary_key=True),
            keep_existing=True,
        )
        self._search_index_location_table = Table(
            "search_index_location",
            metadata,
            Column(
                "workspace_ref_id",
                Integer,
                nullable=False,
                primary_key=True,
            ),
            Column(
                "search_domain_ref_id",
                Integer,
                ForeignKey("search_domain.ref_id"),
                nullable=False,
            ),
            Column("entity_tag", String, nullable=False, primary_key=True),
            Column("entity_ref_id", Integer, nullable=False, primary_key=True),
            Column("location_ref_id", Integer, nullable=False, primary_key=True),
            keep_existing=True,
        )
        self._search_index_visible_to_table = Table(
            "search_index_visible_to",
            metadata,
            Column(
                "workspace_ref_id",
                Integer,
                nullable=False,
                primary_key=True,
            ),
            Column(
                "search_domain_ref_id",
                Integer,
                ForeignKey("search_domain.ref_id"),
                nullable=False,
            ),
            Column("entity_tag", String, nullable=False, primary_key=True),
            Column("entity_ref_id", Integer, nullable=False, primary_key=True),
            Column("user_ref_id", Integer, nullable=False, primary_key=True),
            keep_existing=True,
        )

    @staticmethod
    def _indexed_object_id(entity: AboveGroundEntity) -> str:
        """Stable id for local search rows (``entity_type:ref_id``)."""
        return f"{NamedEntityTag.from_entity(entity).value}:{entity.ref_id.as_int()}"

    async def upsert(
        self,
        workspace_ref_id: EntityId,
        search_domain_ref_id: EntityId,
        entity: AboveGroundEntity,
        note: Note | None,
        tag_ref_ids: Iterable[EntityId],
        contact_ref_ids: Iterable[EntityId],
        locations: list[Location],
        visible_to: Iterable[EntityId],
    ) -> str:
        """Create an entity in the index."""
        note_text = note.flatten_contents() if note is not None else ""
        index_name = indexed_entity_name(entity)
        location_fields = IndexedLocation.from_locations(locations)
        try:
            await self._update(
                workspace_ref_id,
                search_domain_ref_id,
                entity,
                note_text,
                location_fields,
            )
        except EntityNotFoundError:
            await self._connection.execute(
                insert(self._search_index_table).values(
                    workspace_ref_id=workspace_ref_id.as_int(),
                    search_domain_ref_id=search_domain_ref_id.as_int(),
                    entity_tag=str(NamedEntityTag.from_entity(entity).value),
                    parent_ref_id=self._realm_codec_registry.get_encoder(
                        EntityId, DatabaseRealm
                    ).encode(entity.parent_ref_id),
                    ref_id=self._realm_codec_registry.get_encoder(
                        EntityId, DatabaseRealm
                    ).encode(entity.ref_id),
                    name=self._realm_codec_registry.get_encoder(
                        EntityName, DatabaseRealm
                    ).encode(index_name),
                    archived=self._realm_codec_registry.get_encoder(
                        bool, DatabaseRealm
                    ).encode(entity.archived),
                    created_time=self._realm_codec_registry.get_encoder(
                        Timestamp, DatabaseRealm
                    ).encode(entity.created_time),
                    last_modified_time=self._realm_codec_registry.get_encoder(
                        Timestamp, DatabaseRealm
                    ).encode(entity.last_modified_time),
                    archived_time=(
                        self._realm_codec_registry.get_encoder(
                            Timestamp, DatabaseRealm
                        ).encode(entity.archived_time)
                        if entity.archived_time
                        else None
                    ),
                    note=self._realm_codec_registry.get_encoder(
                        str, DatabaseRealm
                    ).encode(note_text),
                    **self._location_column_values(location_fields),
                )
            )
        await self._replace_relationship_rows(
            workspace_ref_id=workspace_ref_id,
            search_domain_ref_id=search_domain_ref_id,
            entity=entity,
            tag_ref_ids=tag_ref_ids,
            contact_ref_ids=contact_ref_ids,
            location_ref_ids=location_fields.ref_ids,
            visible_to=visible_to,
        )
        return PostgresSearchRepository._indexed_object_id(entity)

    async def update_visible_to(
        self,
        workspace_ref_id: EntityId,
        search_domain_ref_id: EntityId,
        entity_type: str,
        entity_ref_id: EntityId,
        object_id: str,
        visible_to: Iterable[EntityId],
    ) -> None:
        """Replace only the visible_to projection for an indexed entity."""
        _ = object_id
        await self._replace_visible_to_rows(
            workspace_ref_id=workspace_ref_id,
            search_domain_ref_id=search_domain_ref_id,
            entity_type=entity_type,
            entity_ref_id=entity_ref_id,
            visible_to=visible_to,
        )

    async def _update(
        self,
        workspace_ref_id: EntityId,
        search_domain_ref_id: EntityId,
        entity: AboveGroundEntity,
        note_text: str,
        location_fields: IndexedLocation,
    ) -> None:
        """Update an entity in the index."""
        index_name = indexed_entity_name(entity)
        query = (
            update(self._search_index_table)
            .where(
                self._search_index_table.c.workspace_ref_id == workspace_ref_id.as_int()
            )
            .where(
                self._search_index_table.c.entity_tag
                == str(NamedEntityTag.from_entity(entity).value)
            )
            .where(self._search_index_table.c.ref_id == entity.ref_id.as_int())
            .values(
                search_domain_ref_id=search_domain_ref_id.as_int(),
                name=self._realm_codec_registry.get_encoder(
                    EntityName, DatabaseRealm
                ).encode(index_name),
                archived=self._realm_codec_registry.get_encoder(
                    bool, DatabaseRealm
                ).encode(entity.archived),
                last_modified_time=self._realm_codec_registry.get_encoder(
                    Timestamp, DatabaseRealm
                ).encode(entity.last_modified_time),
                archived_time=(
                    self._realm_codec_registry.get_encoder(
                        Timestamp, DatabaseRealm
                    ).encode(entity.archived_time)
                    if entity.archived_time
                    else None
                ),
                note=self._realm_codec_registry.get_encoder(str, DatabaseRealm).encode(
                    note_text
                ),
                **self._location_column_values(location_fields),
            )
        )
        result = await self._connection.execute(query)
        if result.rowcount == 0:
            raise EntityNotFoundError(
                "The entity does not exist",
            )

    async def remove(
        self,
        workspace_ref_id: EntityId,
        search_domain_ref_id: EntityId,
        entity: AboveGroundEntity,
    ) -> None:
        """Remove an entity from the index."""
        await self._remove_relationship_rows(workspace_ref_id, entity)
        await self._connection.execute(
            delete(self._search_index_table)
            .where(
                self._search_index_table.c.workspace_ref_id == workspace_ref_id.as_int()
            )
            .where(
                self._search_index_table.c.entity_tag
                == str(NamedEntityTag.from_entity(entity).value)
            )
            .where(self._search_index_table.c.ref_id == entity.ref_id.as_int())
        )

    async def remove_by_object_id(
        self,
        workspace_ref_id: EntityId,
        search_domain_ref_id: EntityId,
        entity_type: str,
        entity_ref_id: EntityId,
        object_id: str,
    ) -> None:
        """Remove by workspace, type, and id (``object_id`` is ignored for PostgreSQL)."""
        _ = search_domain_ref_id
        _ = object_id
        await self._remove_relationship_rows_by_key(
            workspace_ref_id=workspace_ref_id,
            entity_type=entity_type,
            entity_ref_id=entity_ref_id,
        )
        await self._connection.execute(
            delete(self._search_index_table)
            .where(
                self._search_index_table.c.workspace_ref_id == workspace_ref_id.as_int()
            )
            .where(self._search_index_table.c.entity_tag == entity_type)
            .where(self._search_index_table.c.ref_id == entity_ref_id.as_int())
        )

    async def drop(self, workspace_ref_id: EntityId) -> None:
        """Remove everything from the index."""
        await self._connection.execute(
            delete(self._search_index_tag_table).where(
                self._search_index_tag_table.c.workspace_ref_id
                == workspace_ref_id.as_int()
            )
        )
        await self._connection.execute(
            delete(self._search_index_contact_table).where(
                self._search_index_contact_table.c.workspace_ref_id
                == workspace_ref_id.as_int()
            )
        )
        await self._connection.execute(
            delete(self._search_index_location_table).where(
                self._search_index_location_table.c.workspace_ref_id
                == workspace_ref_id.as_int()
            )
        )
        await self._connection.execute(
            delete(self._search_index_visible_to_table).where(
                self._search_index_visible_to_table.c.workspace_ref_id
                == workspace_ref_id.as_int()
            )
        )
        await self._connection.execute(
            delete(self._search_index_table).where(
                self._search_index_table.c.workspace_ref_id == workspace_ref_id.as_int()
            )
        )

    async def search(
        self,
        user_ref_id: EntityId,
        workspace_ref_id: EntityId,
        query: SearchQuery,
        limit: SearchLimit,
        offset: SearchOffset,
        include_archived: bool,
        filter_entity_tags: Iterable[NamedEntityTag] | None,
        filter_tag_ref_ids: Iterable[EntityId] | None,
        filter_contact_ref_ids: Iterable[EntityId] | None,
        filter_location_ref_ids: Iterable[EntityId] | None,
        filter_created_time_after: ADate | None,
        filter_created_time_before: ADate | None,
        filter_last_modified_time_after: ADate | None,
        filter_last_modified_time_before: ADate | None,
        filter_archived_time_after: ADate | None,
        filter_archived_time_before: ADate | None,
    ) -> SearchMatchesPage:
        """Search for entities in the index using trigram ``%`` and ``similarity()``."""
        query_clean = PostgresSearchRepository._clean_query(query).strip()
        if not query_clean:
            return SearchMatchesPage(matches=[], total_match_count=0)

        name_trgm = self._search_index_table.c.name.op("%")(query_clean)
        note_trgm = self._search_index_table.c.note.op("%")(query_clean)
        location_name_trgm = self._search_index_table.c.location_name.op("%")(
            query_clean
        )
        location_address_trgm = self._search_index_table.c.location_address.op("%")(
            query_clean
        )
        location_country_trgm = self._search_index_table.c.location_country.op("%")(
            query_clean
        )
        location_gps_trgm = self._search_index_table.c.location_gps.op("%")(query_clean)
        rank_expr = func.greatest(
            func.similarity(self._search_index_table.c.name, query_clean),
            func.similarity(self._search_index_table.c.note, query_clean),
            func.similarity(self._search_index_table.c.location_name, query_clean),
            func.similarity(self._search_index_table.c.location_address, query_clean),
            func.similarity(self._search_index_table.c.location_country, query_clean),
            func.similarity(self._search_index_table.c.location_gps, query_clean),
        )

        base_wheres = [
            self._search_index_table.c.workspace_ref_id == workspace_ref_id.as_int(),
            or_(
                name_trgm,
                note_trgm,
                location_name_trgm,
                location_address_trgm,
                location_country_trgm,
                location_gps_trgm,
            ),
        ]
        visible_to_exists = (
            select(self._search_index_visible_to_table.c.entity_ref_id)
            .where(
                self._search_index_visible_to_table.c.workspace_ref_id
                == workspace_ref_id.as_int(),
            )
            .where(
                self._search_index_visible_to_table.c.entity_tag
                == self._search_index_table.c.entity_tag
            )
            .where(
                self._search_index_visible_to_table.c.entity_ref_id
                == self._search_index_table.c.ref_id
            )
            .where(
                self._search_index_visible_to_table.c.user_ref_id
                == user_ref_id.as_int()
            )
            .exists()
        )
        base_wheres.append(visible_to_exists)
        if not include_archived:
            base_wheres.append(self._search_index_table.c.archived.is_(False))
        if filter_entity_tags is not None:
            base_wheres.append(
                self._search_index_table.c.entity_tag.in_(
                    str(f.value) for f in filter_entity_tags
                )
            )
        if filter_tag_ref_ids is not None:
            selected_tag_ref_ids = list(
                {ref_id.as_int() for ref_id in filter_tag_ref_ids}
            )
            if len(selected_tag_ref_ids) > 0:
                tag_exists = (
                    select(self._search_index_tag_table.c.entity_ref_id)
                    .where(
                        self._search_index_tag_table.c.workspace_ref_id
                        == workspace_ref_id.as_int(),
                    )
                    .where(
                        self._search_index_tag_table.c.entity_tag
                        == self._search_index_table.c.entity_tag
                    )
                    .where(
                        self._search_index_tag_table.c.entity_ref_id
                        == self._search_index_table.c.ref_id
                    )
                    .where(
                        self._search_index_tag_table.c.tag_ref_id.in_(
                            selected_tag_ref_ids
                        )
                    )
                    .exists()
                )
                base_wheres.append(tag_exists)
        if filter_contact_ref_ids is not None:
            selected_contact_ref_ids = list(
                {ref_id.as_int() for ref_id in filter_contact_ref_ids}
            )
            if len(selected_contact_ref_ids) > 0:
                contact_exists = (
                    select(self._search_index_contact_table.c.entity_ref_id)
                    .where(
                        self._search_index_contact_table.c.workspace_ref_id
                        == workspace_ref_id.as_int(),
                    )
                    .where(
                        self._search_index_contact_table.c.entity_tag
                        == self._search_index_table.c.entity_tag
                    )
                    .where(
                        self._search_index_contact_table.c.entity_ref_id
                        == self._search_index_table.c.ref_id
                    )
                    .where(
                        self._search_index_contact_table.c.contact_ref_id.in_(
                            selected_contact_ref_ids
                        )
                    )
                    .exists()
                )
                base_wheres.append(contact_exists)
        if filter_location_ref_ids is not None:
            selected_location_ref_ids = list(
                {ref_id.as_int() for ref_id in filter_location_ref_ids}
            )
            if len(selected_location_ref_ids) > 0:
                location_exists = (
                    select(self._search_index_location_table.c.entity_ref_id)
                    .where(
                        self._search_index_location_table.c.workspace_ref_id
                        == workspace_ref_id.as_int(),
                    )
                    .where(
                        self._search_index_location_table.c.entity_tag
                        == self._search_index_table.c.entity_tag
                    )
                    .where(
                        self._search_index_location_table.c.entity_ref_id
                        == self._search_index_table.c.ref_id
                    )
                    .where(
                        self._search_index_location_table.c.location_ref_id.in_(
                            selected_location_ref_ids
                        )
                    )
                    .exists()
                )
                base_wheres.append(location_exists)

        adate_encoder = self._realm_codec_registry.get_encoder(ADate, DatabaseRealm)
        if filter_created_time_after is not None:
            base_wheres.append(
                self._search_index_table.c.created_time
                >= adate_encoder.encode(filter_created_time_after)
            )
        if filter_created_time_before is not None:
            base_wheres.append(
                self._search_index_table.c.created_time
                <= adate_encoder.encode(filter_created_time_before)
            )
        if filter_last_modified_time_after is not None:
            base_wheres.append(
                self._search_index_table.c.last_modified_time
                >= adate_encoder.encode(filter_last_modified_time_after)
            )
        if filter_last_modified_time_before is not None:
            base_wheres.append(
                self._search_index_table.c.last_modified_time
                <= adate_encoder.encode(filter_last_modified_time_before)
            )
        if filter_archived_time_after is not None:
            base_wheres.append(
                self._search_index_table.c.archived_time
                >= adate_encoder.encode(filter_archived_time_after)
            )
        if filter_archived_time_before is not None:
            base_wheres.append(
                self._search_index_table.c.archived_time
                <= adate_encoder.encode(filter_archived_time_before)
            )

        count_stmt = select(func.count()).select_from(
            select(self._search_index_table.c.ref_id).where(*base_wheres).subquery()
        )
        count_result = await self._connection.execute(count_stmt)
        total_match_count = int(count_result.scalar_one())

        query_stmt = (
            select(
                self._search_index_table.c.workspace_ref_id,
                self._search_index_table.c.entity_tag,
                self._search_index_table.c.parent_ref_id,
                self._search_index_table.c.ref_id,
                self._search_index_table.c.name,
                self._search_index_table.c.note,
                self._search_index_table.c.archived,
                self._search_index_table.c.created_time,
                self._search_index_table.c.last_modified_time,
                self._search_index_table.c.archived_time,
                rank_expr.label("rank"),
            )
            .where(*base_wheres)
            .order_by(rank_expr.desc())
            .order_by(self._search_index_table.c.archived)
            .order_by(self._search_index_table.c.last_modified_time.desc())
            .limit(limit.the_limit)
            .offset(offset.the_offset)
        )
        results = await self._connection.execute(query_stmt)
        rows = results.mappings().all()
        return SearchMatchesPage(
            matches=[self._row_to_match(row, query_clean) for row in rows],
            total_match_count=total_match_count,
        )

    @staticmethod
    def _snippet_highlight(text: str, query_clean: str, max_len: int = 64) -> str:
        """Wrap the first trigram-relevant span in ``[found]`` markers (FTS-like)."""
        if not text:
            return ""
        q = query_clean.strip()
        if not q:
            return text[:max_len]
        lower = text.lower()
        lower_q = q.lower()
        idx = lower.find(lower_q)
        if idx < 0:
            first = q.split()[0] if q.split() else ""
            if first:
                idx = lower.find(first.lower())
            if idx < 0:
                return "[nomatch]"
        end_idx = min(len(text), idx + max(len(q), max_len))
        start_idx = max(0, idx - 12)
        chunk = text[start_idx:end_idx]
        rel = idx - start_idx
        inner_end = min(rel + len(q), len(chunk))
        return (
            chunk[:rel]
            + "[found]"
            + chunk[rel:inner_end]
            + "[/found]"
            + chunk[inner_end:]
        )

    def _row_to_match(self, row: RowMapping, query_clean: str) -> SearchMatch:
        name = self._realm_codec_registry.get_decoder(EntityName, DatabaseRealm).decode(
            row["name"]
        )
        name_snippet = self._snippet_highlight(str(name), query_clean)
        if name_snippet == "[nomatch]":
            name_snippet = str(name)
        note_raw = self._realm_codec_registry.get_decoder(str, DatabaseRealm).decode(
            row["note"]
        )
        note_snippet = self._snippet_highlight(note_raw, query_clean)
        if note_snippet == "[nomatch]":
            note_snippet = ""
        return SearchMatch(
            summary=EntitySummary(
                entity_tag=self._realm_codec_registry.get_decoder(
                    NamedEntityTag, DatabaseRealm
                ).decode(row["entity_tag"]),
                ref_id=self._realm_codec_registry.get_decoder(
                    EntityId, DatabaseRealm
                ).decode(row["ref_id"]),
                parent_ref_id=self._realm_codec_registry.get_decoder(
                    EntityId, DatabaseRealm
                ).decode(row["parent_ref_id"]),
                name=name,
                archived=self._realm_codec_registry.get_decoder(
                    bool, DatabaseRealm
                ).decode(row["archived"]),
                created_time=self._realm_codec_registry.get_decoder(
                    Timestamp, DatabaseRealm
                ).decode(row["created_time"]),
                archived_time=(
                    self._realm_codec_registry.get_decoder(
                        Timestamp, DatabaseRealm
                    ).decode(row["archived_time"])
                    if row["archived_time"]
                    else None
                ),
                last_modified_time=self._realm_codec_registry.get_decoder(
                    Timestamp, DatabaseRealm
                ).decode(row["last_modified_time"]),
            ),
            search_rank=self._realm_codec_registry.get_decoder(
                float, DatabaseRealm
            ).decode(row["rank"]),
            name_snippet=name_snippet,
            note_snippet=note_snippet,
        )

    @staticmethod
    def _clean_query(query: SearchQuery) -> str:
        """Strip punctuation that confuses tokenization."""
        return str(query).replace('"', " ").replace("'", " ").replace(":", " ")

    def _location_column_values(
        self, location_fields: IndexedLocation
    ) -> dict[str, RealmThing]:
        encode_str = self._realm_codec_registry.get_encoder(str, DatabaseRealm).encode
        return {
            "location_name": encode_str(location_fields.name),
            "location_address": encode_str(location_fields.address),
            "location_country": encode_str(location_fields.country),
            "location_gps": encode_str(location_fields.gps),
        }

    async def _remove_relationship_rows(
        self, workspace_ref_id: EntityId, entity: AboveGroundEntity
    ) -> None:
        await self._remove_relationship_rows_by_key(
            workspace_ref_id=workspace_ref_id,
            entity_type=str(NamedEntityTag.from_entity(entity).value),
            entity_ref_id=entity.ref_id,
        )

    async def _remove_relationship_rows_by_key(
        self,
        workspace_ref_id: EntityId,
        entity_type: str,
        entity_ref_id: EntityId,
    ) -> None:
        await self._connection.execute(
            delete(self._search_index_tag_table)
            .where(
                self._search_index_tag_table.c.workspace_ref_id
                == workspace_ref_id.as_int()
            )
            .where(self._search_index_tag_table.c.entity_tag == entity_type)
            .where(
                self._search_index_tag_table.c.entity_ref_id == entity_ref_id.as_int()
            )
        )
        await self._connection.execute(
            delete(self._search_index_contact_table)
            .where(
                self._search_index_contact_table.c.workspace_ref_id
                == workspace_ref_id.as_int()
            )
            .where(self._search_index_contact_table.c.entity_tag == entity_type)
            .where(
                self._search_index_contact_table.c.entity_ref_id
                == entity_ref_id.as_int()
            )
        )
        await self._connection.execute(
            delete(self._search_index_location_table)
            .where(
                self._search_index_location_table.c.workspace_ref_id
                == workspace_ref_id.as_int()
            )
            .where(self._search_index_location_table.c.entity_tag == entity_type)
            .where(
                self._search_index_location_table.c.entity_ref_id
                == entity_ref_id.as_int()
            )
        )
        await self._connection.execute(
            delete(self._search_index_visible_to_table)
            .where(
                self._search_index_visible_to_table.c.workspace_ref_id
                == workspace_ref_id.as_int()
            )
            .where(self._search_index_visible_to_table.c.entity_tag == entity_type)
            .where(
                self._search_index_visible_to_table.c.entity_ref_id
                == entity_ref_id.as_int()
            )
        )

    async def _replace_relationship_rows(
        self,
        workspace_ref_id: EntityId,
        search_domain_ref_id: EntityId,
        entity: AboveGroundEntity,
        tag_ref_ids: Iterable[EntityId],
        contact_ref_ids: Iterable[EntityId],
        location_ref_ids: Iterable[EntityId],
        visible_to: Iterable[EntityId],
    ) -> None:
        entity_type = str(NamedEntityTag.from_entity(entity).value)
        await self._remove_relationship_rows_by_key(
            workspace_ref_id=workspace_ref_id,
            entity_type=entity_type,
            entity_ref_id=entity.ref_id,
        )
        unique_tag_ref_ids = list({ref_id.as_int() for ref_id in tag_ref_ids})
        if len(unique_tag_ref_ids) > 0:
            await self._connection.execute(
                insert(self._search_index_tag_table),
                [
                    {
                        "workspace_ref_id": workspace_ref_id.as_int(),
                        "search_domain_ref_id": search_domain_ref_id.as_int(),
                        "entity_tag": entity_type,
                        "entity_ref_id": entity.ref_id.as_int(),
                        "tag_ref_id": tag_ref_id,
                    }
                    for tag_ref_id in unique_tag_ref_ids
                ],
            )
        unique_contact_ref_ids = list({ref_id.as_int() for ref_id in contact_ref_ids})
        if len(unique_contact_ref_ids) > 0:
            await self._connection.execute(
                insert(self._search_index_contact_table),
                [
                    {
                        "workspace_ref_id": workspace_ref_id.as_int(),
                        "search_domain_ref_id": search_domain_ref_id.as_int(),
                        "entity_tag": entity_type,
                        "entity_ref_id": entity.ref_id.as_int(),
                        "contact_ref_id": contact_ref_id,
                    }
                    for contact_ref_id in unique_contact_ref_ids
                ],
            )
        unique_location_ref_ids = list({ref_id.as_int() for ref_id in location_ref_ids})
        if len(unique_location_ref_ids) > 0:
            await self._connection.execute(
                insert(self._search_index_location_table),
                [
                    {
                        "workspace_ref_id": workspace_ref_id.as_int(),
                        "search_domain_ref_id": search_domain_ref_id.as_int(),
                        "entity_tag": entity_type,
                        "entity_ref_id": entity.ref_id.as_int(),
                        "location_ref_id": location_ref_id,
                    }
                    for location_ref_id in unique_location_ref_ids
                ],
            )
        unique_visible_to = list({ref_id.as_int() for ref_id in visible_to})
        if len(unique_visible_to) > 0:
            await self._connection.execute(
                insert(self._search_index_visible_to_table),
                [
                    {
                        "workspace_ref_id": workspace_ref_id.as_int(),
                        "search_domain_ref_id": search_domain_ref_id.as_int(),
                        "entity_tag": entity_type,
                        "entity_ref_id": entity.ref_id.as_int(),
                        "user_ref_id": visible_user_ref_id,
                    }
                    for visible_user_ref_id in unique_visible_to
                ],
            )

    async def _replace_visible_to_rows(
        self,
        *,
        workspace_ref_id: EntityId,
        search_domain_ref_id: EntityId,
        entity_type: str,
        entity_ref_id: EntityId,
        visible_to: Iterable[EntityId],
    ) -> None:
        await self._connection.execute(
            delete(self._search_index_visible_to_table)
            .where(
                self._search_index_visible_to_table.c.workspace_ref_id
                == workspace_ref_id.as_int()
            )
            .where(self._search_index_visible_to_table.c.entity_tag == entity_type)
            .where(
                self._search_index_visible_to_table.c.entity_ref_id
                == entity_ref_id.as_int()
            )
        )
        unique_visible_to = list({ref_id.as_int() for ref_id in visible_to})
        if len(unique_visible_to) == 0:
            return
        await self._connection.execute(
            insert(self._search_index_visible_to_table),
            [
                {
                    "workspace_ref_id": workspace_ref_id.as_int(),
                    "search_domain_ref_id": search_domain_ref_id.as_int(),
                    "entity_tag": entity_type,
                    "entity_ref_id": entity_ref_id.as_int(),
                    "user_ref_id": visible_user_ref_id,
                }
                for visible_user_ref_id in unique_visible_to
            ],
        )
