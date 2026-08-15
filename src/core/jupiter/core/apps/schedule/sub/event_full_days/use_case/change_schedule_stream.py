"""Use case for changing the schedule stream of an event."""

from jupiter.core.apps.schedule.sub.event_full_days.root import (
    ScheduleEventFullDays,
)
from jupiter.core.apps.schedule.sub.stream.root import ScheduleStream
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class ScheduleEventFullDaysChangeScheduleStreamArgs(JupiterUpdateCrownEntityArgs):
    """Args."""

    ref_id: EntityId
    schedule_stream_ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleEventFullDaysChangeScheduleStreamUseCase(
    JupiterUpdateCrownEntityUseCase[ScheduleEventFullDaysChangeScheduleStreamArgs, None]
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
        schedule_event_full_days = await self.load_entity(
            uow, context.user.ref_id, ScheduleEventFullDays, args.ref_id
        )
        if not schedule_event_full_days.can_be_modified_independently:
            raise InputValidationError("Cannot change a non-user schedule event")

        if (
            args.schedule_stream_ref_id
            != schedule_event_full_days.schedule_stream_ref_id
        ):
            schedule_stream = await self.load_entity(
                uow,
                context.user.ref_id,
                ScheduleStream,
                args.schedule_stream_ref_id,
            )
            if not schedule_stream.can_be_modified_independently:
                raise InputValidationError(
                    "Cannot change to a non-user schedule stream"
                )

            schedule_event_full_days = schedule_event_full_days.change_schedule_stream(
                context.domain_context,
                schedule_stream_ref_id=args.schedule_stream_ref_id,
            )
            schedule_event_full_days = await uow.get_for(ScheduleEventFullDays).save(
                schedule_event_full_days
            )
            await progress_reporter.mark_updated(schedule_event_full_days)
