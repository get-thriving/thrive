"""Storage engine for search entity indexing map (SQLite only)."""

import abc
from contextlib import AbstractAsyncContextManager

from jupiter.core.search.indexing_map_repository import (
    SearchEntityIndexingMapRepository,
)
from jupiter.core.search.mutation_log_repository import SearchMutationLogRepository
from jupiter.framework.storage.repository import StorageEngine, UnitOfWork


class SearchIndexingUnitOfWork(UnitOfWork):
    """Unit of work for search indexing persistence."""

    @property
    @abc.abstractmethod
    def search_entity_indexing_map_repository(
        self,
    ) -> SearchEntityIndexingMapRepository:
        """The indexing map repository."""

    @property
    @abc.abstractmethod
    def search_mutation_log_repository(self) -> SearchMutationLogRepository:
        """Deferred search indexing queue."""


class SearchIndexingStorageEngine(StorageEngine[SearchIndexingUnitOfWork]):
    """Engine exposing only :class:`SearchEntityIndexingMapRepository`."""

    @abc.abstractmethod
    def get_unit_of_work(
        self,
    ) -> AbstractAsyncContextManager[SearchIndexingUnitOfWork]:
        """Build a unit of work."""
