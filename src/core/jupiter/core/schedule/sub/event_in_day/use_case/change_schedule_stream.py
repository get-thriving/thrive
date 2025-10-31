"""Use case for changing the schedule stream of an event."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.schedule.sub.event_in_day.root import (
    ScheduleEventInDay,
)
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ScheduleEventInDayChangeScheduleStreamArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    schedule_stream_ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleEventInDayChangeScheduleStreamUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        ScheduleEventInDayChangeScheduleStreamArgs, None
    ]
):
    """Use case for changing the schedule stream of an event."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ScheduleEventInDayChangeScheduleStreamArgs,
    ) -> None:
        """Execute the command's action."""
        schedule_stream = await uow.get_for(ScheduleStream).load_by_id(
            args.schedule_stream_ref_id
        )
        if not schedule_stream.can_be_modified_independently:
            raise InputValidationError("Cannot change to a non-user schedule stream")

        schedule_event_in_day = await uow.get_for(ScheduleEventInDay).load_by_id(
            args.ref_id
        )
        if not schedule_event_in_day.can_be_modified_independently:
            raise InputValidationError("Cannot change a non-user schedule event")

        schedule_event_in_day = schedule_event_in_day.change_schedule_stream(
            context.domain_context,
            schedule_stream_ref_id=args.schedule_stream_ref_id,
        )
        schedule_event_in_day = await uow.get_for(ScheduleEventInDay).save(
            schedule_event_in_day
        )
        await progress_reporter.mark_updated(schedule_event_in_day)
