"""PostgreSQL-backed search storage engine."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from types import TracebackType
from typing import Final

from jupiter.core.search.impl.postgres.repository import PostgresSearchRepository
from jupiter.core.search.repository import SearchRepository
from jupiter.core.search.storage_engine import SearchStorageEngine, SearchUnitOfWork
from jupiter.framework.realm.realm import RealmCodecRegistry
from jupiter.framework.storage.postgres.connection import PostgresConnection
from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import AsyncEngine


class PostgresSearchUnitOfWork(SearchUnitOfWork):
    """PostgreSQL search unit of work."""

    _search_repository: Final[PostgresSearchRepository]

    def __init__(self, search_repository: PostgresSearchRepository) -> None:
        """Constructor."""
        self._search_repository = search_repository

    def __enter__(self) -> "PostgresSearchUnitOfWork":
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


class PostgresSearchStorageEngine(SearchStorageEngine):
    """PostgreSQL search storage engine."""

    _realm_codec_registry: Final[RealmCodecRegistry]
    _sql_engine: Final[AsyncEngine]
    _metadata: Final[MetaData]

    def __init__(
        self, realm_codec_registry: RealmCodecRegistry, connection: PostgresConnection
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
            search_repository = PostgresSearchRepository(
                self._realm_codec_registry, connection, self._metadata
            )
            yield PostgresSearchUnitOfWork(search_repository=search_repository)
