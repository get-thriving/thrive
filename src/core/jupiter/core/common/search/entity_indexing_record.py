"""Persistent map of domain entities to search index object ids."""

import abc

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import ParentLink
from jupiter.framework.record import Record, record
from jupiter.framework.storage.repository import RecordRepository


@record("SearchDomain")
class SearchEntityIndexingRecord(Record):
    """One row in ``search_entity_indexing_map``."""

    search_domain: ParentLink
    entity_type: str
    entity_ref_id: EntityId
    object_id: str
    index_method_version: int

    @property
    def raw_key(self) -> object:
        """Stable composite key for this map row."""
        return (self.search_domain.ref_id, self.entity_type, self.entity_ref_id)


class SearchEntityIndexingRecordRepository(
    RecordRepository[SearchEntityIndexingRecord, tuple[EntityId, str, EntityId]],
    abc.ABC,
):
    """Repository for :class:`SearchEntityIndexingRecord`."""

    @abc.abstractmethod
    async def find_all_for_search_domain_entity_type(
        self, search_domain_ref_id: EntityId, entity_type: str
    ) -> list[SearchEntityIndexingRecord]:
        """All map rows for a search domain and entity type string (e.g. ``TodoTask``)."""

    @abc.abstractmethod
    async def load_optional(
        self,
        search_domain_ref_id: EntityId,
        entity_type: str,
        entity_ref_id: EntityId,
    ) -> SearchEntityIndexingRecord | None:
        """Return the map row for one entity, if present."""

    @abc.abstractmethod
    async def upsert(self, record: SearchEntityIndexingRecord) -> None:
        """Insert or replace a row."""

    @abc.abstractmethod
    async def remove_all_for_search_domain(
        self, search_domain_ref_id: EntityId
    ) -> None:
        """Remove every map row for a search domain (e.g. test teardown)."""
