"""Domain-level storage interaction."""

import abc
from contextlib import AbstractAsyncContextManager

from jupiter.core.domain.application.search.infra.search_repository import (
    SearchRepository,
)
from jupiter.framework.storage.repository import StorageEngine, UnitOfWork


class SearchUnitOfWork(UnitOfWork):
    """A unit of work from a search engine."""

    @property
    @abc.abstractmethod
    def search_repository(self) -> SearchRepository:
        """The search repostory."""


class SearchStorageEngine(StorageEngine[SearchUnitOfWork]):
    """A storage engine of some form for the search engine."""

    @abc.abstractmethod
    def get_unit_of_work(self) -> AbstractAsyncContextManager[SearchUnitOfWork]:
        """Build a unit of work."""
