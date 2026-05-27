"""PostgreSQL implementation of schedules infra classes."""

from jupiter.core.schedule.sub.export.root import (
    ScheduleExport,
    ScheduleExportRepository,
)
from jupiter.core.schedule.sub.external_sync_log.entry import (
    ScheduleExternalSyncLogEntry,
    ScheduleExternalSyncLogEntryRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.postgres.repository import (
    PostgresLeafEntityRepository,
)
from jupiter.framework.storage.repository import EntityNotFoundError
from sqlalchemy import (
    select,
)


class PostgresScheduleExternalSyncLogEntryRepository(
    PostgresLeafEntityRepository[ScheduleExternalSyncLogEntry],
    ScheduleExternalSyncLogEntryRepository,
):
    """PostgreSQL implementation of the schedule external sync log entry repository."""

    async def find_last(
        self, parent_ref_id: EntityId, limit: int
    ) -> list[ScheduleExternalSyncLogEntry]:
        """Find the last N schedule external sync log entries."""
        if limit < 0:
            raise InputValidationError("Limit must be non-negative")
        if limit > 1000:
            raise InputValidationError("Limit must be less than or equal to 1000")
        query_stmt = (
            select(self._table)
            .where(
                self._table.c.schedule_external_sync_log_ref_id
                == parent_ref_id.as_int()
            )
            .order_by(self._table.c.created_time.desc())
            .limit(limit)
        )
        result = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in result]


class PostgresScheduleExportRepository(
    PostgresLeafEntityRepository[ScheduleExport],
    ScheduleExportRepository,
):
    """PostgreSQL implementation of the schedule export repository."""

    async def load_by_guid(
        self, external_id: str, allow_archived: bool = False
    ) -> ScheduleExport:
        """Load a schedule export by its external GUID."""
        query_stmt = select(self._table).where(self._table.c.external_id == external_id)
        if not allow_archived:
            query_stmt = query_stmt.where(self._table.c.archived.is_(False))

        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise EntityNotFoundError(
                f"Schedule export with external id {external_id} does not exist"
            )
        return self._row_to_entity(result)
