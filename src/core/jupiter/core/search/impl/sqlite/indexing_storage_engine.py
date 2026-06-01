"""SQLite :class:`SearchIndexingStorageEngine`."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Final

from jupiter.core.search.entity_indexing_record import (
    SearchEntityIndexingRecordRepository,
)
from jupiter.core.search.impl.sqlite.entity_indexing_record_repository import (
    SqliteSearchEntityIndexingRecordRepository,
)
from jupiter.core.search.impl.sqlite.mutation_log_record_repository import (
    SqliteSearchMutationLogRecordRepository,
)
from jupiter.core.search.indexing_storage_engine import (
    SearchIndexingStorageEngine,
    SearchIndexingUnitOfWork,
)
from jupiter.core.search.mutation_log_record import SearchMutationLogRecordRepository
from jupiter.framework.realm.realm import RealmCodecRegistry
from jupiter.framework.storage.sqlite.connection import SqliteConnection
from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import AsyncEngine


class SqliteSearchIndexingUnitOfWork(SearchIndexingUnitOfWork):
    """SQLite UoW."""

    _search_entity_indexing_record_repository: Final[
        SqliteSearchEntityIndexingRecordRepository
    ]
    _search_mutation_log_record_repository: Final[
        SqliteSearchMutationLogRecordRepository
    ]

    def __init__(
        self,
        search_entity_indexing_record_repository: SqliteSearchEntityIndexingRecordRepository,
        search_mutation_log_record_repository: SqliteSearchMutationLogRecordRepository,
    ) -> None:
        """Constructor."""
        self._search_entity_indexing_record_repository = (
            search_entity_indexing_record_repository
        )
        self._search_mutation_log_record_repository = (
            search_mutation_log_record_repository
        )

    @property
    def search_entity_indexing_record_repository(
        self,
    ) -> SearchEntityIndexingRecordRepository:
        """The entity indexing map repository."""
        return self._search_entity_indexing_record_repository

    @property
    def search_mutation_log_record_repository(
        self,
    ) -> SearchMutationLogRecordRepository:
        """Deferred search indexing queue."""
        return self._search_mutation_log_record_repository


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
            map_repo = SqliteSearchEntityIndexingRecordRepository(
                self._realm_codec_registry, connection, self._metadata
            )
            log_repo = SqliteSearchMutationLogRecordRepository(
                self._realm_codec_registry, connection, self._metadata
            )
            yield SqliteSearchIndexingUnitOfWork(
                search_entity_indexing_record_repository=map_repo,
                search_mutation_log_record_repository=log_repo,
            )
