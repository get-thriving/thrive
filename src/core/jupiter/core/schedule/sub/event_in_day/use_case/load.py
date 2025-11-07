"""Use case for loading a schedule in day event."""

from jupiter.core.common.notes.root import Note
from jupiter.core.common.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.schedule.sub.event_in_day.root import (
    ScheduleEventInDay,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)
from jupiter.framework.utils.generic_loader import generic_loader


@use_case_args
class ScheduleEventInDayLoadArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class ScheduleEventInDayLoadResult(UseCaseResultBase):
    """Result."""

    schedule_event_in_day: ScheduleEventInDay
    time_event_in_day_block: TimeEventInDayBlock
    note: Note | None


@readonly_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleEventInDayLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        ScheduleEventInDayLoadArgs, ScheduleEventInDayLoadResult
    ]
):
    """Use case for loading a schedule in day event."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ScheduleEventInDayLoadArgs,
    ) -> ScheduleEventInDayLoadResult:
        """Execute the command's action."""
        schedule_event_in_day, time_event_in_day_block, note = await generic_loader(
            uow,
            ScheduleEventInDay,
            args.ref_id,
            ScheduleEventInDay.time_event_in_day_block,
            ScheduleEventInDay.note,
            allow_archived=args.allow_archived,
        )

        return ScheduleEventInDayLoadResult(
            schedule_event_in_day=schedule_event_in_day,
            time_event_in_day_block=time_event_in_day_block,
            note=note,
        )
