"""Use case for creating a schedule in day event."""

from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.common.time_in_day import TimeInDay
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.schedule.sub.event_in_day.name import ScheduleEventInDayName
from jupiter.core.schedule.sub.event_in_day.root import (
    ScheduleEventInDay,
)
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class ScheduleEventInDayCreateArgs(JupiterCreateCrownEntityArgs):
    """Args."""

    schedule_stream_ref_id: EntityId
    name: ScheduleEventInDayName
    start_date: ADate
    start_time_in_day: TimeInDay
    duration_mins: int


@use_case_result
class ScheduleEventInDayCreateResult(UseCaseResultBase):
    """Result."""

    new_schedule_event_in_day: ScheduleEventInDay
    new_time_event_in_day_block: TimeEventInDayBlock


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleEventInDayCreateUseCase(
    JupiterCreateCrownEntityUseCase[
        ScheduleEventInDayCreateArgs, ScheduleEventInDayCreateResult
    ]
):
    """Use case for creating a schedule in day event."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ScheduleEventInDayCreateArgs,
    ) -> ScheduleEventInDayCreateResult:
        """Execute the command's action."""
        schedule_stream = await self.load_entity(
            uow,
            context.user.ref_id,
            ScheduleStream,
            args.schedule_stream_ref_id,
        )

        if not schedule_stream.can_be_modified_independently:
            raise InputValidationError(
                "Cannot create an event for a schedule stream that can't be modified."
            )

        # Events belong with the stream they hang off, so a writer on a shared
        # stream files the event in the stream owner's workspace.
        owner_workspace_ref_id = await self.find_entity_workspace(uow, schedule_stream)
        schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
            owner_workspace_ref_id
        )
        time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
            owner_workspace_ref_id
        )

        new_schedule_event_in_day = (
            ScheduleEventInDay.new_schedule_event_in_day_for_user(
                context.domain_context,
                schedule_domain_ref_id=schedule_domain.ref_id,
                schedule_stream_ref_id=schedule_stream.ref_id,
                name=args.name,
            )
        )
        new_schedule_event_in_day = await self.create_entity(
            context.domain_context,
            uow,
            progress_reporter,
            context.user.ref_id,
            new_schedule_event_in_day,
        )

        new_time_event_in_day_block = (
            TimeEventInDayBlock.new_time_event_for_schedule_event(
                context.domain_context,
                time_event_domain_ref_id=time_event_domain.ref_id,
                schedule_event_ref_id=new_schedule_event_in_day.ref_id,
                start_date=args.start_date,
                start_time_in_day=args.start_time_in_day,
                duration_mins=args.duration_mins,
            )
        )
        new_time_event_in_day_block = await uow.get_for(TimeEventInDayBlock).create(
            new_time_event_in_day_block
        )

        return ScheduleEventInDayCreateResult(
            new_schedule_event_in_day=new_schedule_event_in_day,
            new_time_event_in_day_block=new_time_event_in_day_block,
        )
