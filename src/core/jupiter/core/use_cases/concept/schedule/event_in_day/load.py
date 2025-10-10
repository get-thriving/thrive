"""Use case for loading a schedule in day event."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyUseCaseContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domain.concept.schedule.schedule_event_in_day import (
    ScheduleEventInDay,
)
from jupiter.core.domain.core.notes.note import Note
from jupiter.core.domain.core.time_events.time_event_in_day_block import (
    TimeEventInDayBlock,
)
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.infra.generic_loader import generic_loader
from jupiter.framework_new.use_case import (
    readonly_use_case,
)
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


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
        context: JupiterLoggedInReadonlyUseCaseContext,
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
