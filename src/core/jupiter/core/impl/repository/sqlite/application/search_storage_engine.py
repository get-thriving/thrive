"""The real implementation of an engine."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from types import TracebackType
from typing import (
    Final,
)

from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import AsyncEngine

from jupiter.core.domainx.application.search.infra.search_repository import (
    SearchRepository,
)
from jupiter.core.impl.repository.sqlite.application.search import (
    SqliteSearchRepository,
)
from jupiter.core.storage_engine import SearchStorageEngine, SearchUnitOfWork
from jupiter.framework.realm.realm import RealmCodecRegistry
from jupiter.framework.storage.sqlite.connection import SqliteConnection


class SqliteSearchUnitOfWork(SearchUnitOfWork):
    """A Sqlite specific search unit of work."""

    _search_repository: Final[SqliteSearchRepository]

    def __init__(self, search_repository: SqliteSearchRepository) -> None:
        """Constructor."""
        self._search_repository = search_repository

    def __enter__(self) -> "SqliteSearchUnitOfWork":
        """Enter the context."""
        return self

    def __exit__(
        self,
        _exc_type: type[BaseException] | None,
        _exc_val: BaseException | None,
        _exc_tb: TracebackType | None,
    ) -> None:
        """Exit context."""

    @property
    def search_repository(self) -> SearchRepository:
        """The search repository."""
        return self._search_repository


class SqliteSearchStorageEngine(SearchStorageEngine):
    """An Sqlite specific engine."""

    _realm_codec_registry: Final[RealmCodecRegistry]
    _sql_engine: Final[AsyncEngine]
    _metadata: Final[MetaData]

    def __init__(
        self, realm_codec_registry: RealmCodecRegistry, connection: SqliteConnection
    ) -> None:
        """Constructor."""
        self._realm_codec_registry = realm_codec_registry
        self._sql_engine = connection.sql_engine
        self._metadata = MetaData()

    async def initialize(self) -> None:
        """Initialize the storage engine."""
        async with self._sql_engine.connect() as conn:
            await conn.run_sync(self._metadata.reflect)

    @asynccontextmanager
    async def get_unit_of_work(self) -> AsyncIterator[SearchUnitOfWork]:
        """Get the unit of work."""
        async with self._sql_engine.begin() as connection:
            search_repository = SqliteSearchRepository(
                self._realm_codec_registry, connection, self._metadata
            )
            yield SqliteSearchUnitOfWork(search_repository=search_repository)
