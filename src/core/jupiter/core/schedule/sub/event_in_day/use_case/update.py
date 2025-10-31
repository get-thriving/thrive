"""Use case for updating a schedule in day event."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.core.time_events.time_event_in_day_block import (
    TimeEventInDayBlockRepository,
)
from jupiter.core.domain.core.time_events.time_event_namespace import TimeEventNamespace
from jupiter.core.domain.core.time_in_day import TimeInDay
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.schedule.sub.event_in_day.name import ScheduleEventInDayName
from jupiter.core.schedule.sub.event_in_day.root import (
    ScheduleEventInDay,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ScheduleEventInDayUpdateArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    name: UpdateAction[ScheduleEventInDayName]
    start_date: UpdateAction[ADate]
    start_time_in_day: UpdateAction[TimeInDay]
    duration_mins: UpdateAction[int]


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleEventInDayUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ScheduleEventInDayUpdateArgs, None]
):
    """Use case for updating a schedule in day event."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ScheduleEventInDayUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        schedule_event_in_day = await uow.get_for(ScheduleEventInDay).load_by_id(
            args.ref_id
        )
        if not schedule_event_in_day.can_be_modified_independently:
            raise InputValidationError("Cannot update a non-user schedule event")
        schedule_event_in_day = schedule_event_in_day.update(
            context.domain_context,
            name=args.name,
        )
        schedule_event_in_day = await uow.get_for(ScheduleEventInDay).save(
            schedule_event_in_day
        )
        await progress_reporter.mark_updated(schedule_event_in_day)

        time_event = await uow.get(TimeEventInDayBlockRepository).load_for_namespace(
            TimeEventNamespace.SCHEDULE_EVENT_IN_DAY, schedule_event_in_day.ref_id
        )
        time_event = time_event.update(
            context.domain_context,
            start_date=args.start_date,
            start_time_in_day=args.start_time_in_day,
            duration_mins=args.duration_mins,
        )
        await uow.get(TimeEventInDayBlockRepository).save(time_event)
