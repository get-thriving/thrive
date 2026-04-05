"""SQlite based repository for the invocation record of mutation use cases."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from types import TracebackType
from typing import Final

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.mutation_inovcation.entity_event import MutationEntityEvent
from jupiter.framework.mutation_inovcation.invocation_record import (
    MutationInvocationRecord,
    MutationInvocationResult,
)
from jupiter.framework.mutation_inovcation.recorders.persistent import (
    MutationInvocationRecordRepository,
    MutationInvocationStorageEngine,
    MutationInvocationUnitOfWork,
)
from jupiter.framework.realm.realm import RealmCodecRegistry
from jupiter.framework.storage.sqlite.connection import SqliteConnection
from jupiter.framework.storage.sqlite.events import (
    build_event_table,
    find_entity_events_between,
    find_entity_events_by_timestamp_desc,
)
from jupiter.framework.storage.sqlite.repository import SqliteRepository
from sqlalchemy import (
    JSON,
    Column,
    DateTime,
    MetaData,
    String,
    Table,
    delete,
    insert,
    select,
)
from sqlalchemy.ext.asyncio import AsyncConnection, AsyncEngine


class SqliteMutationInvocationRecordRepository(
    SqliteRepository,
    MutationInvocationRecordRepository,
):
    """A SQlite repository for mutation use cases invocation records."""

    _mutation_invocation_record_table: Final[Table]
    _mutation_entity_event_table: Final[Table]

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
            Column("trace_id", String, primary_key=True),
            Column("mutation_id", String, primary_key=True),
            Column("timestamp", DateTime, primary_key=True),
            Column("context_str", String, primary_key=True),
            Column("name", String, primary_key=True),
            Column("args", JSON, nullable=False),
            Column("result", String, nullable=False),
            Column("error_str", String, nullable=True),
            keep_existing=True,
        )
        self._mutation_entity_event_table = build_event_table(
            self._mutation_invocation_record_table, metadata
        )

    async def create(
        self,
        invocation_record: MutationInvocationRecord,
    ) -> None:
        """Create a new invocation record."""
        await self._connection.execute(
            insert(self._mutation_invocation_record_table).values(
                trace_id=self._realm_codec_registry.db_encode(
                    invocation_record.trace_id
                ),
                mutation_id=self._realm_codec_registry.db_encode(
                    invocation_record.mutation_id
                ),
                timestamp=self._realm_codec_registry.db_encode(
                    invocation_record.timestamp
                ),
                context_str=invocation_record.context_str,
                name=invocation_record.name,
                args=invocation_record.args,
                result=str(invocation_record.result.value),
                error_str=invocation_record.error_str,
            ),
        )

    async def find_all(
        self,
        mutation_ids: list[MutationId],
    ) -> list[MutationInvocationRecord]:
        """Find all invocation records matching the given mutation ids."""
        query_stmt = select(self._mutation_invocation_record_table).where(
            self._mutation_invocation_record_table.c.mutation_id.in_(
                [self._realm_codec_registry.db_encode(mid) for mid in mutation_ids]
            )
        )
        results = await self._connection.execute(query_stmt)
        return [
            MutationInvocationRecord(
                trace_id=self._realm_codec_registry.db_decode(TraceId, row.trace_id),
                mutation_id=self._realm_codec_registry.db_decode(
                    MutationId, row.mutation_id
                ),
                timestamp=self._realm_codec_registry.db_decode(
                    Timestamp, row.timestamp
                ),
                context_str=row.context_str,
                name=row.name,
                args=row.args,
                result=MutationInvocationResult(row.result),
                error_str=row.error_str,
            )
            for row in results
        ]

    _MAX_FIND_ALL_LIMIT: int = 200

    async def find_all_entity_events_by_timestamp_desc(
        self,
        entity_type: str,
        entity_ref_id: EntityId,
        offset: int,
        limit: int,
    ) -> tuple[list[MutationEntityEvent], int]:
        """Find all entity events in descending timestamp order with pagination."""
        if offset < 0:
            raise ValueError(f"Offset must be non-negative but was {offset}")
        if limit <= 0 or limit > self._MAX_FIND_ALL_LIMIT:
            raise ValueError(
                f"Limit must be between 1 and {self._MAX_FIND_ALL_LIMIT} but was {limit}"
            )
        return await find_entity_events_by_timestamp_desc(
            self._realm_codec_registry,
            self._connection,
            self._mutation_entity_event_table,
            entity_type,
            entity_ref_id,
            offset,
            limit,
        )

    async def find_all_entity_events_between(
        self,
        entity_type: str,
        entity_ref_id: EntityId,
        start: Timestamp,
        end: Timestamp,
    ) -> list[MutationEntityEvent]:
        """Find all entity events between two timestamps."""
        return await find_entity_events_between(
            self._realm_codec_registry,
            self._connection,
            self._mutation_entity_event_table,
            entity_type,
            entity_ref_id,
            start,
            end,
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
