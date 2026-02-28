"""Use case for creating a time event associated with a big plan."""

from jupiter.core.big_plans.root import BigPlan
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.common.time_in_day import TimeInDay
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class TimeEventInDayBlockCreateForBigPlanArgs(UseCaseArgsBase):
    """Args."""

    big_plan_ref_id: EntityId
    start_date: ADate
    start_time_in_day: TimeInDay
    duration_mins: int


@use_case_result
class TimeEventInDayBlockCreateForBigPlanResult(UseCaseResultBase):
    """Result."""

    new_time_event: TimeEventInDayBlock


@mutation_use_case()
class TimeEventInDayBlockCreateForBigPlanUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        TimeEventInDayBlockCreateForBigPlanArgs,
        TimeEventInDayBlockCreateForBigPlanResult,
    ]
):
    """Use case for creating a time event associated with a big plan."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimeEventInDayBlockCreateForBigPlanArgs,
    ) -> TimeEventInDayBlockCreateForBigPlanResult:
        """Execute the command's action."""
        workspace = context.workspace
        time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
            workspace.ref_id
        )

        big_plan = await uow.get_for(BigPlan).load_by_id(args.big_plan_ref_id)

        new_time_event = TimeEventInDayBlock.new_time_event_for_big_plan(
            context.domain_context,
            time_event_domain_ref_id=time_event_domain.ref_id,
            big_plan_ref_id=big_plan.ref_id,
            start_date=args.start_date,
            start_time_in_day=args.start_time_in_day,
            duration_mins=args.duration_mins,
        )
        new_time_event = await uow.get_for(TimeEventInDayBlock).create(new_time_event)

        return TimeEventInDayBlockCreateForBigPlanResult(new_time_event=new_time_event)
