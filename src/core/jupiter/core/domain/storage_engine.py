"""Domain-level storage interaction."""

import abc
from contextlib import AbstractAsyncContextManager
from typing import TypeVar, overload

from jupiter.framework_new.repository import StorageEngine, UnitOfWork
from jupiter.core.domain.application.search.infra.search_repository import (
    SearchRepository,
)

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
