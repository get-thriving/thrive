"""Use case for loading history of runs."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterLoggedInReadonlyUseCase,
)
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.schedule.sub.external_sync_log.entry import (
    ScheduleExternalSyncLogEntry,
    ScheduleExternalSyncLogEntryRepository,
)
from jupiter.core.schedule.sub.external_sync_log.root import (
    ScheduleExternalSyncLog,
)
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class ScheduleExternalSyncLoadRunsArgs(UseCaseArgsBase):
    """Args."""


@use_case_result
class ScheduleExternalSyncLoadRunsResult(UseCaseResultBase):
    """Result."""

    entries: list[ScheduleExternalSyncLogEntry]


@readonly_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleExternalSyncLoadRunsUseCase(
    JupiterLoggedInReadonlyUseCase[
        ScheduleExternalSyncLoadRunsArgs, ScheduleExternalSyncLoadRunsResult
    ]
):
    """Use case for loading external sync runs."""

    async def _execute(
        self,
        context: JupiterLoggedInReadonlyContext,
        args: ScheduleExternalSyncLoadRunsArgs,
    ) -> ScheduleExternalSyncLoadRunsResult:
        """Execute the use case."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
                context.workspace.ref_id
            )

            sync_logs = await uow.get_for(ScheduleExternalSyncLog).find_all(
                parent_ref_id=schedule_domain.ref_id,
                allow_archived=False,
            )
            if len(sync_logs) != 1:
                raise Exception("Expected exactly one sync log for the schedule domain")
            sync_log = sync_logs[0]

            sync_log_entry = await uow.get(
                ScheduleExternalSyncLogEntryRepository
            ).find_last(sync_log.ref_id, 30)

        return ScheduleExternalSyncLoadRunsResult(entries=sync_log_entry)
