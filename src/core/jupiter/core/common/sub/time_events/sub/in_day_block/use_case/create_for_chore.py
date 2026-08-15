"""Use case for creating a time event associated with a chore."""

from jupiter.core.apps.chores.root import Chore
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.common.time_in_day import TimeInDay
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterCreateLeafSupportEntityArgs,
    JupiterCreateLeafSupportEntityUseCase,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
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
class TimeEventInDayBlockCreateForChoreArgs(JupiterCreateLeafSupportEntityArgs):
    """Args."""

    chore_ref_id: EntityId
    start_date: ADate
    start_time_in_day: TimeInDay
    duration_mins: int


@use_case_result
class TimeEventInDayBlockCreateForChoreResult(UseCaseResultBase):
    """Result."""

    new_time_event: TimeEventInDayBlock


@mutation_use_case()
class TimeEventInDayBlockCreateForChoreUseCase(
    JupiterCreateLeafSupportEntityUseCase[
        TimeEventInDayBlockCreateForChoreArgs,
        TimeEventInDayBlockCreateForChoreResult,
    ]
):
    """Use case for creating a time event associated with a chore."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimeEventInDayBlockCreateForChoreArgs,
    ) -> TimeEventInDayBlockCreateForChoreResult:
        """Execute the command's action."""
        chore, owner_workspace_ref_id = await self.load_owner_entity(
            uow, context.user.ref_id, Chore, args.chore_ref_id
        )
        time_event_domain = await self.load_parent(
            uow, TimeEventDomain, owner_workspace_ref_id
        )

        new_time_event = TimeEventInDayBlock.new_time_event_for_chore(
            context.domain_context,
            time_event_domain_ref_id=time_event_domain.ref_id,
            chore_ref_id=chore.ref_id,
            start_date=args.start_date,
            start_time_in_day=args.start_time_in_day,
            duration_mins=args.duration_mins,
        )
        new_time_event = await uow.get_for(TimeEventInDayBlock).create(new_time_event)

        return TimeEventInDayBlockCreateForChoreResult(new_time_event=new_time_event)
