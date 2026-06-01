"""PostgreSQL :class:`CRMIndexingStorageEngine`."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Final

from jupiter.core.crm.entity_indexing_record import CRMEntityIndexingRecordRepository
from jupiter.core.crm.impl.postgres.entity_indexing_record_repository import (
    PostgresCRMEntityIndexingRecordRepository,
)
from jupiter.core.crm.indexing_storage_engine import (
    CRMIndexingStorageEngine,
    CRMIndexingUnitOfWork,
)
from jupiter.framework.realm.realm import RealmCodecRegistry
from jupiter.framework.storage.postgres.connection import PostgresConnection
from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import AsyncEngine


class PostgresCRMIndexingUnitOfWork(CRMIndexingUnitOfWork):
    """PostgreSQL UoW."""

    _crm_entity_indexing_record_repository: Final[
        PostgresCRMEntityIndexingRecordRepository
    ]

    def __init__(
        self,
        crm_entity_indexing_record_repository: PostgresCRMEntityIndexingRecordRepository,
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


class PostgresCRMIndexingStorageEngine(CRMIndexingStorageEngine):
    """PostgreSQL-backed CRM indexing map engine (same DB as domain)."""

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
        """Reflect schema."""
        async with self._sql_engine.connect() as conn:
            await conn.run_sync(self._metadata.reflect)

    @asynccontextmanager
    async def get_unit_of_work(self) -> AsyncIterator[CRMIndexingUnitOfWork]:
        """Open a transaction."""
        async with self._sql_engine.begin() as connection:
            map_repo = PostgresCRMEntityIndexingRecordRepository(
                self._realm_codec_registry, connection, self._metadata
            )
            yield PostgresCRMIndexingUnitOfWork(
                crm_entity_indexing_record_repository=map_repo,
            )
