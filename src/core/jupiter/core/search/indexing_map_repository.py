"""Repository for :class:`SearchEntityIndexingRecord`."""

import abc

from jupiter.core.search.entity_indexing_record import SearchEntityIndexingRecord
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import Repository


class SearchEntityIndexingMapRepository(Repository, abc.ABC):
    """Maps indexed entities to provider-specific object ids."""

    @abc.abstractmethod
    async def find_all_for_workspace_entity_type(
        self, workspace_ref_id: EntityId, entity_type: str
    ) -> list[SearchEntityIndexingRecord]:
        """All map rows for a workspace and entity type string (e.g. ``TodoTask``)."""

    @abc.abstractmethod
    async def load_optional(
        self,
        workspace_ref_id: EntityId,
        entity_type: str,
        entity_ref_id: EntityId,
    ) -> SearchEntityIndexingRecord | None:
        """Return the map row for one entity, if present."""

    @abc.abstractmethod
    async def upsert(self, record: SearchEntityIndexingRecord) -> None:
        """Insert or replace a row."""

    @abc.abstractmethod
    async def remove(
        self, workspace_ref_id: EntityId, entity_type: str, entity_ref_id: EntityId
    ) -> None:
        """Remove one row if present."""

    @abc.abstractmethod
    async def remove_all_for_workspace(self, workspace_ref_id: EntityId) -> None:
        """Remove every map row for a workspace (e.g. test teardown)."""
