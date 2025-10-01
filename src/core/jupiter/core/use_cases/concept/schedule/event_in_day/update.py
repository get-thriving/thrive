"""Use case for updating a schedule in day event."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.schedule.schedule_event_in_day import (
    ScheduleEventInDay,
)
from jupiter.core.domain.concept.schedule.schedule_event_name import ScheduleEventName
from jupiter.core.domain.core.time_events.time_event_in_day_block import (
    TimeEventInDayBlockRepository,
)
from jupiter.core.domain.core.time_events.time_event_namespace import TimeEventNamespace
from jupiter.core.domain.core.time_in_day import TimeInDay
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.use_cases.infra.use_cases import (
    mutation_use_case,
)
from jupiter.framework_new.base.adate import ADate
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.errors import InputValidationError
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.update_action import UpdateAction
from jupiter.framework_new.use_case import ProgressReporter
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ScheduleEventInDayUpdateArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    name: UpdateAction[ScheduleEventName]
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
        context: JupiterLoggedInMutationUseCaseContext,
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
