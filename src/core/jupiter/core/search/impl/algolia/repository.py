"""The Algolia based search repository."""

from __future__ import annotations

import hashlib
import json
import re
from collections.abc import Iterable
from typing import Final

import pendulum
from algoliasearch.search.client import SearchClient
from algoliasearch.search.models.hit import Hit
from jupiter.core.common.entity_summary import EntitySummary
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.instance import Instance
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.search.limit import SearchLimit
from jupiter.core.search.offset import SearchOffset
from jupiter.core.search.query import SearchQuery
from jupiter.core.search.repository import (
    SearchMatch,
    SearchMatchesPage,
    SearchRepository,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.entity import CrownEntity
from jupiter.framework.realm.realm import DatabaseRealm, RealmCodecRegistry, RealmThing
from pendulum.tz.timezone import UTC


class AlgoliaSearchRepository(SearchRepository):
    """Search index backed by Algolia (``algoliasearch`` v4 ``SearchClient`` async API)."""

    _realm_codec_registry: Final[RealmCodecRegistry]
    _client: Final[SearchClient]
    _index_name: Final[str]
    _instance: Final[Instance]

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        client: SearchClient,
        index_name: str,
        instance: Instance,
    ) -> None:
        """Constructor."""
        self._realm_codec_registry = realm_codec_registry
        self._client = client
        self._index_name = index_name
        self._instance = instance

    async def upsert(
        self,
        workspace_ref_id: EntityId,
        entity: CrownEntity,
        note: Note | None,
    ) -> None:
        """Create or replace an entity in the index."""
        note_text = note.flatten_contents() if note is not None else ""
        record = self._entity_to_record(workspace_ref_id, entity, note_text)
        await self._client.save_objects(self._index_name, [record])

    async def remove(self, workspace_ref_id: EntityId, entity: CrownEntity) -> None:
        """Remove an entity from the search index."""
        object_id = self._object_id(workspace_ref_id, entity)
        await self._client.delete_objects(self._index_name, [object_id])

    async def drop(self, workspace_ref_id: EntityId) -> None:
        """Remove all entries for a workspace (and this deployment instance)."""
        filters = self._compose_filters(
            [
                f"workspace_ref_id:{workspace_ref_id.as_int()}",
                self._instance_filter(),
            ]
        )
        await self._client.delete_by(self._index_name, {"filters": filters})

    async def search(
        self,
        workspace_ref_id: EntityId,
        query: SearchQuery,
        limit: SearchLimit,
        offset: SearchOffset,
        include_archived: bool,
        filter_entity_tags: Iterable[NamedEntityTag] | None,
        filter_created_time_after: ADate | None,
        filter_created_time_before: ADate | None,
        filter_last_modified_time_after: ADate | None,
        filter_last_modified_time_before: ADate | None,
        filter_archived_time_after: ADate | None,
        filter_archived_time_before: ADate | None,
    ) -> SearchMatchesPage:
        """Search for entities in the index."""
        query_clean = AlgoliaSearchRepository._clean_query(query)
        filter_parts: list[str] = [
            f"workspace_ref_id:{workspace_ref_id.as_int()}",
            self._instance_filter(),
        ]
        if not include_archived:
            filter_parts.append("archived:false")
        if filter_entity_tags is not None:
            tags = [str(t.value) for t in filter_entity_tags]
            if len(tags) == 0:
                filter_parts.append("entity_tag:__none__")
            elif len(tags) == 1:
                filter_parts.append(f"entity_tag:{self._quote_filter_value(tags[0])}")
            else:
                or_clause = " OR ".join(
                    f"entity_tag:{self._quote_filter_value(t)}" for t in tags
                )
                filter_parts.append(f"({or_clause})")

        if filter_created_time_after is not None:
            filter_parts.append(
                f"created_time>={self._adate_lower_bound_ts(filter_created_time_after)}"
            )
        if filter_created_time_before is not None:
            filter_parts.append(
                f"created_time<={self._adate_upper_bound_ts(filter_created_time_before)}"
            )
        if filter_last_modified_time_after is not None:
            filter_parts.append(
                "last_modified_time>="
                f"{self._adate_lower_bound_ts(filter_last_modified_time_after)}"
            )
        if filter_last_modified_time_before is not None:
            filter_parts.append(
                "last_modified_time<="
                f"{self._adate_upper_bound_ts(filter_last_modified_time_before)}"
            )
        if filter_archived_time_after is not None:
            filter_parts.append(
                f"archived_time>={self._adate_lower_bound_ts(filter_archived_time_after)}"
            )
        if filter_archived_time_before is not None:
            filter_parts.append(
                f"archived_time<={self._adate_upper_bound_ts(filter_archived_time_before)}"
            )

        search_params = {
            "query": query_clean,
            "filters": self._compose_filters(filter_parts),
            "hitsPerPage": limit.the_limit,
            "offset": offset.the_offset,
            "attributesToHighlight": ["name", "note"],
            "attributesToSnippet": ["name:64", "note:64"],
        }

        response = await self._client.search_single_index(
            self._index_name,
            search_params,
        )
        hits = response.hits or []
        total_match_count = (
            int(response.nb_hits) if response.nb_hits is not None else 0
        )
        return SearchMatchesPage(
            matches=[
                self._hit_to_match(hit, offset.the_offset + rank)
                for rank, hit in enumerate(hits)
            ],
            total_match_count=total_match_count,
        )

    def _entity_to_record(
        self,
        workspace_ref_id: EntityId,
        entity: CrownEntity,
        note_text: str,
    ) -> dict[str, RealmThing]:
        enc = self._realm_codec_registry.get_encoder
        entity_tag = str(NamedEntityTag.from_entity(entity).value)
        archived_time = (
            enc(Timestamp, DatabaseRealm).encode(entity.archived_time)
            if entity.archived_time
            else None
        )
        archived_ts = (
            self._realm_thing_to_unix(archived_time)
            if archived_time is not None
            else None
        )
        return {
            "objectID": self._object_id(workspace_ref_id, entity),
            "instance": str(self._instance),
            "workspace_ref_id": workspace_ref_id.as_int(),
            "entity_tag": entity_tag,
            "parent_ref_id": enc(EntityId, DatabaseRealm).encode(entity.parent_ref_id),
            "ref_id": enc(EntityId, DatabaseRealm).encode(entity.ref_id),
            "name": enc(EntityName, DatabaseRealm).encode(entity.name),
            "note": enc(str, DatabaseRealm).encode(note_text),
            "archived": enc(bool, DatabaseRealm).encode(entity.archived),
            "created_time": self._timestamp_unix(entity.created_time),
            "last_modified_time": self._timestamp_unix(entity.last_modified_time),
            **({"archived_time": archived_ts} if archived_ts is not None else {}),
        }

    def _hit_to_match(self, hit: Hit, rank: int) -> SearchMatch:
        raw = json.loads(hit.model_dump_json(by_alias=True))
        return self._hit_dict_to_match(raw, rank)

    def _hit_dict_to_match(self, hit: dict[str, RealmThing], rank: int) -> SearchMatch:
        dec = self._realm_codec_registry.get_decoder
        name = dec(EntityName, DatabaseRealm).decode(hit["name"])
        name_snippet = self._snippet_text(hit, "name") or str(name)
        return SearchMatch(
            summary=EntitySummary(
                entity_tag=dec(NamedEntityTag, DatabaseRealm).decode(hit["entity_tag"]),
                ref_id=dec(EntityId, DatabaseRealm).decode(hit["ref_id"]),
                parent_ref_id=dec(EntityId, DatabaseRealm).decode(hit["parent_ref_id"]),
                name=name,
                archived=dec(bool, DatabaseRealm).decode(hit["archived"]),
                created_time=dec(Timestamp, DatabaseRealm).decode(
                    self._unix_to_realm_thing(hit["created_time"])
                ),
                archived_time=(
                    dec(Timestamp, DatabaseRealm).decode(
                        self._unix_to_realm_thing(hit["archived_time"])
                    )
                    if hit.get("archived_time") is not None
                    else None
                ),
                last_modified_time=dec(Timestamp, DatabaseRealm).decode(
                    self._unix_to_realm_thing(hit["last_modified_time"])
                ),
            ),
            search_rank=float(rank),
            name_snippet=name_snippet,
            note_snippet=self._snippet_text(hit, "note"),
        )

    def _snippet_text(self, hit: dict[str, RealmThing], attr: str) -> str:
        snippet_result = hit.get("_snippetResult")
        if not isinstance(snippet_result, dict):
            return ""
        snippet_block = snippet_result.get(attr)
        if not isinstance(snippet_block, dict):
            return ""
        value = snippet_block.get("value", "")
        if not isinstance(value, str):
            return ""
        return re.sub(r"</?em>", "", value)

    def _object_id(self, workspace_ref_id: EntityId, entity: CrownEntity) -> str:
        entity_tag = str(NamedEntityTag.from_entity(entity).value)
        raw = (
            f"{self._instance.the_instance}\0{workspace_ref_id.as_int()}\0{entity_tag}\0"
            f"{entity.ref_id.as_int()}"
        )
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    def _instance_filter(self) -> str:
        return f"instance:{self._quote_filter_value(str(self._instance))}"

    @staticmethod
    def _quote_filter_value(value: str) -> str:
        escaped = value.replace("\\", "\\\\").replace('"', '\\"')
        return f'"{escaped}"'

    @staticmethod
    def _compose_filters(parts: list[str]) -> str:
        return " AND ".join(parts)

    def _adate_lower_bound_ts(self, adate: ADate) -> float:
        d = adate.the_date
        dt = pendulum.datetime(d.year, d.month, d.day, 0, 0, 0, tz=UTC)
        return Timestamp.from_date_and_time(dt).the_ts.timestamp()

    def _adate_upper_bound_ts(self, adate: ADate) -> float:
        encoded = self._realm_codec_registry.get_encoder(ADate, DatabaseRealm).encode(
            adate
        )
        return self._realm_thing_to_unix(encoded)

    def _realm_thing_to_unix(self, value: RealmThing) -> float:
        ts = self._realm_codec_registry.get_decoder(Timestamp, DatabaseRealm).decode(
            value
        )
        return self._timestamp_unix(ts)

    def _timestamp_unix(self, ts: Timestamp) -> float:
        return ts.the_ts.timestamp()

    def _unix_to_realm_thing(self, value: RealmThing) -> RealmThing:
        if isinstance(value, (int, float)):
            dt = pendulum.from_timestamp(float(value), tz=UTC)
            return self._realm_codec_registry.get_encoder(
                Timestamp, DatabaseRealm
            ).encode(Timestamp.from_date_and_time(dt))
        return value

    @staticmethod
    def _clean_query(query: SearchQuery) -> str:
        """Strip characters that Algolia treats specially in query strings."""
        return str(query).replace('"', " ").replace("'", " ").replace(":", " ")
