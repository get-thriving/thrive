"""Storage engine for search indexing persistence."""

import abc
from contextlib import AbstractAsyncContextManager

from jupiter.core.search.entity_indexing_record import (
    SearchEntityIndexingRecordRepository,
)
from jupiter.core.search.mutation_log_record import SearchMutationLogRecordRepository
from jupiter.framework.storage.repository import StorageEngine, UnitOfWork


class SearchIndexingUnitOfWork(UnitOfWork):
    """Unit of work for search indexing persistence."""

    @property
    @abc.abstractmethod
    def search_entity_indexing_record_repository(
        self,
    ) -> SearchEntityIndexingRecordRepository:
        """The entity indexing map repository."""

    @property
    @abc.abstractmethod
    def search_mutation_log_record_repository(
        self,
    ) -> SearchMutationLogRecordRepository:
        """Deferred search indexing queue."""


class SearchIndexingStorageEngine(StorageEngine[SearchIndexingUnitOfWork]):
    """Engine exposing search indexing record repositories."""

    @abc.abstractmethod
    def get_unit_of_work(
        self,
    ) -> AbstractAsyncContextManager[SearchIndexingUnitOfWork]:
        """Build a unit of work."""
