"""The command for creating a big plan milestone."""

from jupiter.core.apps.big_plans.root import BigPlan
from jupiter.core.apps.big_plans.sub.milestones.root import BigPlanMilestone
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
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
class BigPlanMilestoneCreateArgs(JupiterCreateCrownEntityArgs):
    """Big plan milestone create args."""

    big_plan_ref_id: EntityId
    date: ADate
    name: EntityName


@use_case_result
class BigPlanMilestoneCreateResult(UseCaseResultBase):
    """Big plan milestone create result."""

    new_big_plan_milestone: BigPlanMilestone
    new_time_event_block: TimeEventFullDaysBlock


@mutation_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanMilestoneCreateUseCase(
    JupiterCreateCrownEntityUseCase[
        BigPlanMilestoneCreateArgs, BigPlanMilestoneCreateResult
    ]
):
    """The command for creating a big plan milestone."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: BigPlanMilestoneCreateArgs,
    ) -> BigPlanMilestoneCreateResult:
        """Execute the command's action."""
        big_plan = await self.load_entity(
            uow, context.user.ref_id, BigPlan, args.big_plan_ref_id
        )
        # The block belongs with the big plan rather than with whoever adds the
        # milestone, so it goes in the big plan's own workspace - a shared big
        # plan's milestones show up on its owner's calendar, not the editor's.
        big_plan_workspace_ref_id = await self.find_entity_workspace(uow, big_plan)
        time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
            big_plan_workspace_ref_id,
        )

        if big_plan.actionable_date and args.date < big_plan.actionable_date:
            raise InputValidationError(
                f"Milestone date {args.date} must be after big plan's actionable date {big_plan.actionable_date}"
            )

        if big_plan.due_date and args.date > big_plan.due_date:
            raise InputValidationError(
                f"Milestone date {args.date} must be before big plan's due date {big_plan.due_date}"
            )

        new_big_plan_milestone = BigPlanMilestone.new_big_plan_milestone(
            context.domain_context,
            big_plan_ref_id=args.big_plan_ref_id,
            date=args.date,
            name=args.name,
        )
        new_big_plan_milestone = await self.create_entity(
            context.domain_context,
            uow,
            progress_reporter,
            context.user.ref_id,
            new_big_plan_milestone,
        )

        new_time_event_block = (
            TimeEventFullDaysBlock.new_time_event_for_big_plan_milestone(
                context.domain_context,
                time_event_domain_ref_id=time_event_domain.ref_id,
                big_plan_milestone_ref_id=new_big_plan_milestone.ref_id,
                milestone_date=new_big_plan_milestone.date,
            )
        )
        new_time_event_block = await uow.get_for(TimeEventFullDaysBlock).create(
            new_time_event_block,
        )

        return BigPlanMilestoneCreateResult(
            new_big_plan_milestone=new_big_plan_milestone,
            new_time_event_block=new_time_event_block,
        )
