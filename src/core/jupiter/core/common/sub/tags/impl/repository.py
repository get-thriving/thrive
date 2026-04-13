"""Sqlite implementations of tags repositories."""

from jupiter.core.common.sub.tags.sub.link.root import (
    TagLink,
    TagLinkRepository,
)
from jupiter.core.common.sub.tags.sub.tag.root import (
    Tag,
    TagAlreadyExistsError,
    TagRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.realm.realm import RealmCodecRegistry
from jupiter.framework.storage.sqlite.events import upsert_events
from jupiter.framework.storage.sqlite.repository import SqliteLeafEntityRepository
from sqlalchemy import MetaData, select
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.ext.asyncio import AsyncConnection


class SqliteTagRepository(SqliteLeafEntityRepository[Tag], TagRepository):
    """SQLite implementation of the tag repository."""

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(
            realm_codec_registry,
            connection,
            metadata,
            already_exists_err_cls=TagAlreadyExistsError,
        )

    async def upsert(self, tag: Tag) -> Tag:
        """Upsert a tag for a name within the tag domain."""
        stmt = (
            sqlite_insert(self._table)
            .values(
                version=tag.version,
                archived=tag.archived,
                archival_reason=tag.archival_reason,
                created_time=self._realm_codec_registry.db_encode(tag.created_time),
                last_modified_time=self._realm_codec_registry.db_encode(
                    tag.last_modified_time
                ),
                archived_time=self._realm_codec_registry.db_encode(tag.archived_time),
                tag_domain_ref_id=tag.tag_domain.ref_id.as_int(),
                name=tag.name.the_name,
            )
            .on_conflict_do_update(
                index_elements=["tag_domain_ref_id", "name"],
                set_={
                    "version": tag.version,
                    "archived": tag.archived,
                    "archival_reason": tag.archival_reason,
                    "last_modified_time": self._realm_codec_registry.db_encode(
                        tag.last_modified_time
                    ),
                    "archived_time": self._realm_codec_registry.db_encode(
                        tag.archived_time
                    ),
                },
            )
            .returning(self._table.c.ref_id)
        )

        result = await self._connection.execute(stmt)
        new_id = result.scalar_one()

        tag = tag.assign_ref_id(EntityId(new_id))

        await upsert_events(
            self._realm_codec_registry,
            self._connection,
            self._event_table,
            tag,
        )

        return tag


class SqliteTagLinkRepository(SqliteLeafEntityRepository[TagLink], TagLinkRepository):
    """SQLite implementation of the tag link repository."""

    async def upsert(self, tag_link: TagLink) -> TagLink:
        """Upsert a tag link."""
        stmt = (
            sqlite_insert(self._table)
            .values(
                version=tag_link.version,
                archived=tag_link.archived,
                archival_reason=tag_link.archival_reason,
                created_time=self._realm_codec_registry.db_encode(
                    tag_link.created_time
                ),
                last_modified_time=self._realm_codec_registry.db_encode(
                    tag_link.last_modified_time
                ),
                archived_time=self._realm_codec_registry.db_encode(
                    tag_link.archived_time
                ),
                name=tag_link.name.the_name,
                tag_domain_ref_id=tag_link.tag_domain.ref_id.as_int(),
                owner=self._realm_codec_registry.db_encode(tag_link.owner),
                ref_ids=[rid.as_int() for rid in tag_link.ref_ids],
            )
            .on_conflict_do_update(
                index_elements=["owner"],
                set_={
                    "version": tag_link.version,
                    "archived": tag_link.archived,
                    "archival_reason": tag_link.archival_reason,
                    "tag_domain_ref_id": tag_link.tag_domain.ref_id.as_int(),
                    "last_modified_time": self._realm_codec_registry.db_encode(
                        tag_link.last_modified_time
                    ),
                    "archived_time": self._realm_codec_registry.db_encode(
                        tag_link.archived_time
                    ),
                    "ref_ids": [rid.as_int() for rid in tag_link.ref_ids],
                },
            )
            .returning(self._table.c.ref_id)
        )

        result = await self._connection.execute(stmt)
        new_id = result.scalar_one()

        tag_link = tag_link.assign_ref_id(EntityId(new_id))

        await upsert_events(
            self._realm_codec_registry,
            self._connection,
            self._event_table,
            tag_link,
        )

        return tag_link

    async def load_optional_for_owner(
        self,
        owner: EntityLink,
    ) -> TagLink | None:
        """Load a tag link by its owner link."""
        encoded = self._realm_codec_registry.db_encode(owner)
        query_stmt = select(self._table).where(self._table.c.owner == encoded)
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            return None
        return self._row_to_entity(result)
