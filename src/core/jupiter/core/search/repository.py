"""A search index repository for free form searching across all entities in jupiter."""

import abc
from collections.abc import Iterable

from jupiter.core.common.entity_summary import EntitySummary
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.search.limit import SearchLimit
from jupiter.core.search.query import SearchQuery
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import CrownEntity
from jupiter.framework.storage.repository import Repository
from jupiter.framework.value import CompositeValue, value


@value
class SearchMatch(CompositeValue):
    """Information about a particular entity that was found."""

    summary: EntitySummary
    search_rank: float  # lower is better


class SearchRepository(Repository, abc.ABC):
    """A search index repository for free form searching across all entities."""

    @abc.abstractmethod
    async def upsert(self, workspace_ref_id: EntityId, entity: CrownEntity) -> None:
        """Add an entity and make it available for searching."""

    @abc.abstractmethod
    async def remove(self, workspace_ref_id: EntityId, entity: CrownEntity) -> None:
        """Remove an entity from the search index."""

    @abc.abstractmethod
    async def drop(self, workspace_ref_id: EntityId) -> None:
        """Remove all entries from the search index for a particular workspace."""

    @abc.abstractmethod
    async def search(
        self,
        workspace_ref_id: EntityId,
        query: SearchQuery,
        limit: SearchLimit,
        include_archived: bool,
        filter_entity_tags: Iterable[NamedEntityTag] | None,
        filter_created_time_after: ADate | None,
        filter_created_time_before: ADate | None,
        filter_last_modified_time_after: ADate | None,
        filter_last_modified_time_before: ADate | None,
        filter_archived_time_after: ADate | None,
        filter_archived_time_before: ADate | None,
    ) -> list[SearchMatch]:
        """Search for entities."""
