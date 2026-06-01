"""SQLite :class:`CRMIndexingStorageEngine`."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Final

from jupiter.core.crm.entity_indexing_record import CRMEntityIndexingRecordRepository
from jupiter.core.crm.impl.sqlite.entity_indexing_record_repository import (
    SqliteCRMEntityIndexingRecordRepository,
)
from jupiter.core.crm.indexing_storage_engine import (
    CRMIndexingStorageEngine,
    CRMIndexingUnitOfWork,
)
from jupiter.framework.realm.realm import RealmCodecRegistry
from jupiter.framework.storage.sqlite.connection import SqliteConnection
from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import AsyncEngine


class SqliteCRMIndexingUnitOfWork(CRMIndexingUnitOfWork):
    """SQLite UoW."""

    _crm_entity_indexing_record_repository: Final[
        SqliteCRMEntityIndexingRecordRepository
    ]

    def __init__(
        self,
        crm_entity_indexing_record_repository: SqliteCRMEntityIndexingRecordRepository,
    ) -> None:
        """Constructor."""
        self._crm_entity_indexing_record_repository = (
            crm_entity_indexing_record_repository
        )

    @property
    def crm_entity_indexing_record_repository(
        self,
    ) -> CRMEntityIndexingRecordRepository:
        """The entity indexing map repository."""
        return self._crm_entity_indexing_record_repository


class SqliteCRMIndexingStorageEngine(CRMIndexingStorageEngine):
    """SQLite-backed CRM indexing map engine (same DB file as domain)."""

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
    async def get_unit_of_work(self) -> AsyncIterator[CRMIndexingUnitOfWork]:
        """Open a transaction."""
        async with self._sql_engine.begin() as connection:
            map_repo = SqliteCRMEntityIndexingRecordRepository(
                self._realm_codec_registry, connection, self._metadata
            )
            yield SqliteCRMIndexingUnitOfWork(
                crm_entity_indexing_record_repository=map_repo,
            )
