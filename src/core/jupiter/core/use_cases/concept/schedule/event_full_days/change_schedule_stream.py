"""Use case for changing the schedule stream of an event."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.schedule.schedule_event_full_days import (
    ScheduleEventFullDays,
)
from jupiter.core.domain.concept.schedule.schedule_stream import ScheduleStream
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.errors import InputValidationError
from jupiter.framework_new.progress_reporter.reporter import ProgressReporter
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ScheduleEventFullDaysChangeScheduleStreamArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    schedule_stream_ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleEventFullDaysChangeScheduleStreamUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        ScheduleEventFullDaysChangeScheduleStreamArgs, None
    ]
):
    """Use case for changing the schedule stream of an event."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ScheduleEventFullDaysChangeScheduleStreamArgs,
    ) -> None:
        """Execute the command's action."""
        schedule_stream = await uow.get_for(ScheduleStream).load_by_id(
            args.schedule_stream_ref_id
        )
        if not schedule_stream.can_be_modified_independently:
            raise InputValidationError("Cannot change to a non-user schedule stream")

        schedule_event_full_days = await uow.get_for(ScheduleEventFullDays).load_by_id(
            args.ref_id
        )
        if not schedule_event_full_days.can_be_modified_independently:
            raise InputValidationError("Cannot change a non-user schedule event")

        schedule_event_full_days = schedule_event_full_days.change_schedule_stream(
            context.domain_context,
            schedule_stream_ref_id=args.schedule_stream_ref_id,
        )
        schedule_event_full_days = await uow.get_for(ScheduleEventFullDays).save(
            schedule_event_full_days
        )

        await progress_reporter.mark_updated(schedule_event_full_days)
