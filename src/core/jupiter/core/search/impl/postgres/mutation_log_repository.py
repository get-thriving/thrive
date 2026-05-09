"""PostgreSQL persistence for :class:`SearchMutationLogRepository`."""

from typing import Final, cast

from jupiter.core.search.mutation_log_record import SearchMutationLogRecord
from jupiter.core.search.mutation_log_repository import SearchMutationLogRepository
from jupiter.core.search.mutation_log_status import SearchMutationLogStatus
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.entity import ParentLink
from jupiter.framework.realm.realm import DatabaseRealm, RealmCodecRegistry, RealmThing
from jupiter.framework.storage.postgres.repository import PostgresRepository
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    MetaData,
    String,
    Table,
    delete,
    select,
    update,
)
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncConnection


class PostgresSearchMutationLogRepository(
    PostgresRepository, SearchMutationLogRepository
):
    """PostgreSQL table ``search_mutation_log``."""

    _table: Final[Table]

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(realm_codec_registry, connection, metadata)
        self._table = Table(
            "search_mutation_log",
            metadata,
            Column("mutation_id", String, primary_key=True, nullable=False),
            Column(
                "workspace_ref_id",
                Integer,
                ForeignKey("workspace.ref_id"),
                nullable=False,
            ),
            Column("created_time", DateTime(timezone=True), nullable=False),
            Column("last_modified_time", DateTime(timezone=True), nullable=False),
            Column("status", String, nullable=False),
            keep_existing=True,
        )

    def _row_to_record(self, row: dict[str, object]) -> SearchMutationLogRecord:
        dec = self._realm_codec_registry.get_decoder
        return SearchMutationLogRecord(
            created_time=dec(Timestamp, DatabaseRealm).decode(
                cast(RealmThing, row["created_time"])
            ),
            last_modified_time=dec(Timestamp, DatabaseRealm).decode(
                cast(RealmThing, row["last_modified_time"])
            ),
            workspace=ParentLink(
                dec(EntityId, DatabaseRealm).decode(
                    cast(RealmThing, row["workspace_ref_id"])
                )
            ),
            mutation_id=dec(MutationId, DatabaseRealm).decode(
                cast(RealmThing, row["mutation_id"])
            ),
            status=SearchMutationLogStatus(row["status"]),
        )

    async def append_unindexed(self, record: SearchMutationLogRecord) -> None:
        """Insert or ignore on duplicate primary key."""
        enc = self._realm_codec_registry.get_encoder
        values = {
            "mutation_id": enc(MutationId, DatabaseRealm).encode(record.mutation_id),
            "workspace_ref_id": enc(EntityId, DatabaseRealm).encode(
                record.workspace.ref_id
            ),
            "created_time": enc(Timestamp, DatabaseRealm).encode(record.created_time),
            "last_modified_time": enc(Timestamp, DatabaseRealm).encode(
                record.last_modified_time
            ),
            "status": record.status.value,
        }
        stmt = (
            pg_insert(self._table)
            .values(**values)
            .on_conflict_do_nothing(
                index_elements=["mutation_id"],
            )
        )
        await self._connection.execute(stmt)

    async def find_all_unindexed_ordered_by_created_time(
        self, limit: int, claim_at: Timestamp
    ) -> list[SearchMutationLogRecord]:
        """Atomically claim oldest ``unindexed`` rows as ``processing`` and return them."""
        enc = self._realm_codec_registry.get_encoder
        encoded_ts = enc(Timestamp, DatabaseRealm).encode(claim_at)
        picked = (
            select(self._table.c.mutation_id)
            .where(self._table.c.status == SearchMutationLogStatus.UNINDEXED.value)
            .order_by(self._table.c.created_time.asc())
            .limit(limit)
            .cte("picked")
        )
        stmt = (
            update(self._table)
            .where(
                self._table.c.mutation_id.in_(select(picked.c.mutation_id)),
            )
            .values(
                status=SearchMutationLogStatus.PROCESSING.value,
                last_modified_time=encoded_ts,
            )
            .returning(
                self._table.c.mutation_id,
                self._table.c.workspace_ref_id,
                self._table.c.created_time,
                self._table.c.last_modified_time,
                self._table.c.status,
            )
        )
        result = await self._connection.execute(stmt)
        rows = result.mappings().all()
        return [self._row_to_record(dict(row)) for row in rows]

    async def update_status(
        self,
        mutation_id: MutationId,
        status: SearchMutationLogStatus,
        *,
        last_modified_time: Timestamp,
    ) -> None:
        """Persist a new status and touch ``last_modified_time``."""
        enc = self._realm_codec_registry.get_encoder
        await self._connection.execute(
            update(self._table)
            .where(
                self._table.c.mutation_id
                == enc(MutationId, DatabaseRealm).encode(mutation_id)
            )
            .values(
                status=status.value,
                last_modified_time=enc(Timestamp, DatabaseRealm).encode(
                    last_modified_time
                ),
            ),
        )

    async def reset_all_processing_to_unindexed(self, at: Timestamp) -> int:
        """Re-queue every row stuck in ``processing``."""
        enc = self._realm_codec_registry.get_encoder
        result = await self._connection.execute(
            update(self._table)
            .where(self._table.c.status == SearchMutationLogStatus.PROCESSING.value)
            .values(
                status=SearchMutationLogStatus.UNINDEXED.value,
                last_modified_time=enc(Timestamp, DatabaseRealm).encode(at),
            ),
        )
        return int(result.rowcount or 0)

    async def remove_all_for_workspace(self, workspace_ref_id: EntityId) -> None:
        """Delete all mutation-log rows for one workspace."""
        enc = self._realm_codec_registry.get_encoder
        await self._connection.execute(
            delete(self._table).where(
                self._table.c.workspace_ref_id
                == enc(EntityId, DatabaseRealm).encode(workspace_ref_id)
            ),
        )
