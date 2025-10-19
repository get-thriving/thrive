"""SQlite based repository for the invocation record of mutation use cases."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from types import TracebackType
from typing import Final

from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.impl.storage.sqlite.connection import SqliteConnection
from jupiter.framework_new.impl.storage.sqlite.repository import SqliteRepository
from jupiter.framework_new.mutation_inovcation.record import (
    MutationInvocationRecord,
)
from jupiter.framework_new.mutation_inovcation.recorders.persistent import (
    MutationInvocationRecordRepository,
    MutationInvocationStorageEngine,
    MutationInvocationUnitOfWork,
)
from jupiter.framework_new.realm import RealmCodecRegistry
from sqlalchemy import (
    JSON,
    Column,
    DateTime,
    MetaData,
    String,
    Table,
    delete,
    insert,
)
from sqlalchemy.ext.asyncio import AsyncConnection, AsyncEngine


class SqliteMutationInvocationRecordRepository(
    SqliteRepository,
    MutationInvocationRecordRepository,
):
    """A SQlite repository for mutation use cases invocation records."""

    _mutation_invocation_record_table: Final[Table]

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(realm_codec_registry, connection, metadata)
        self._mutation_invocation_record_table = Table(
            "mutation_invocation_record",
            metadata,
            Column("context_str", String, primary_key=True),
            Column("timestamp", DateTime, primary_key=True),
            Column("name", String, primary_key=True),
            Column("args", JSON, nullable=False),
            Column("result", String, nullable=False),
            Column("error_str", String, nullable=True),
            keep_existing=True,
        )

    async def create(
        self,
        invocation_record: MutationInvocationRecord,
    ) -> None:
        """Create a new invocation record."""
        await self._connection.execute(
            insert(self._mutation_invocation_record_table).values(
                context_str=invocation_record.context_str,
                timestamp=self._realm_codec_registry.db_encode(
                    invocation_record.timestamp
                ),
                name=invocation_record.name,
                args=invocation_record.args,
                result=str(invocation_record.result.value),
                error_str=invocation_record.error_str,
            ),
        )

    async def clear_all(self, context_str: str) -> None:
        """Clear all entries in the invocation record."""
        await self._connection.execute(
            delete(self._mutation_invocation_record_table).where(
                self._mutation_invocation_record_table.c.context_str == context_str
            ),
        )


class SqliteMutationInvocationUnitOfWork(MutationInvocationUnitOfWork):
    """The SQLite storage unit of work."""

    _mutation_invocation_record_repository: Final[
        SqliteMutationInvocationRecordRepository
    ]

    def __init__(
        self,
        mutation_invocation_record_repository: SqliteMutationInvocationRecordRepository,
    ) -> None:
        """Constructor."""
        self._mutation_invocation_record_repository = (
            mutation_invocation_record_repository
        )

    def __enter__(self) -> "SqliteMutationInvocationUnitOfWork":
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
    def mutation_invocation_record_repository(
        self,
    ) -> MutationInvocationRecordRepository:
        """The mutation use case invocation record repository."""
        return self._mutation_invocation_record_repository


class SqliteMutationInvocationStorageEngine(MutationInvocationStorageEngine):
    """Sqlite based use case storage engine."""

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
    async def get_unit_of_work(self) -> AsyncIterator[MutationInvocationUnitOfWork]:
        """Get the unit of work."""
        async with self._sql_engine.begin() as connection:
            mutation_invocation_record_repository = (
                SqliteMutationInvocationRecordRepository(
                    self._realm_codec_registry,
                    connection,
                    self._metadata,
                )
            )
            yield SqliteMutationInvocationUnitOfWork(
                mutation_invocation_record_repository=mutation_invocation_record_repository,
            )
