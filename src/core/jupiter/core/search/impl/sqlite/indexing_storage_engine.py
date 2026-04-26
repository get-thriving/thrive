"""SQLite :class:`SearchIndexingStorageEngine`."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Final

from jupiter.core.search.impl.sqlite.indexing_map_repository import (
    SqliteSearchEntityIndexingMapRepository,
)
from jupiter.core.search.impl.sqlite.mutation_log_repository import (
    SqliteSearchMutationLogRepository,
)
from jupiter.core.search.indexing_map_repository import (
    SearchEntityIndexingMapRepository,
)
from jupiter.core.search.indexing_storage_engine import (
    SearchIndexingStorageEngine,
    SearchIndexingUnitOfWork,
)
from jupiter.core.search.mutation_log_repository import SearchMutationLogRepository
from jupiter.framework.realm.realm import RealmCodecRegistry
from jupiter.framework.storage.sqlite.connection import SqliteConnection
from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import AsyncEngine


class SqliteSearchIndexingUnitOfWork(SearchIndexingUnitOfWork):
    """SQLite UoW."""

    _search_entity_indexing_map_repository: Final[
        SqliteSearchEntityIndexingMapRepository
    ]
    _search_mutation_log_repository: Final[SqliteSearchMutationLogRepository]

    def __init__(
        self,
        search_entity_indexing_map_repository: SqliteSearchEntityIndexingMapRepository,
        search_mutation_log_repository: SqliteSearchMutationLogRepository,
    ) -> None:
        """Constructor."""
        self._search_entity_indexing_map_repository = (
            search_entity_indexing_map_repository
        )
        self._search_mutation_log_repository = search_mutation_log_repository

    @property
    def search_entity_indexing_map_repository(
        self,
    ) -> SearchEntityIndexingMapRepository:
        """The indexing map repository."""
        return self._search_entity_indexing_map_repository

    @property
    def search_mutation_log_repository(self) -> SearchMutationLogRepository:
        """Deferred search indexing queue."""
        return self._search_mutation_log_repository


class SqliteSearchIndexingStorageEngine(SearchIndexingStorageEngine):
    """SQLite-backed indexing map engine (same DB file as domain)."""

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
        """Reflect schema."""
        async with self._sql_engine.connect() as conn:
            await conn.run_sync(self._metadata.reflect)

    @asynccontextmanager
    async def get_unit_of_work(self) -> AsyncIterator[SearchIndexingUnitOfWork]:
        """Open a transaction."""
        async with self._sql_engine.begin() as connection:
            map_repo = SqliteSearchEntityIndexingMapRepository(
                self._realm_codec_registry, connection, self._metadata
            )
            log_repo = SqliteSearchMutationLogRepository(
                self._realm_codec_registry, connection, self._metadata
            )
            yield SqliteSearchIndexingUnitOfWork(
                search_entity_indexing_map_repository=map_repo,
                search_mutation_log_repository=log_repo,
            )
