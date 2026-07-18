"""The command for updating a big plan milestone."""

from jupiter.core.big_plans.root import BigPlan
from jupiter.core.big_plans.sub.milestones.root import BigPlanMilestone
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    use_case_args,
)


@use_case_args
class BigPlanMilestoneUpdateArgs(JupiterUpdateCrownEntityArgs):
    """Big plan milestone update args."""

    ref_id: EntityId
    date: UpdateAction[ADate]
    name: UpdateAction[EntityName]


@mutation_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanMilestoneUpdateUseCase(
    JupiterUpdateCrownEntityUseCase[BigPlanMilestoneUpdateArgs, None]
):
    """The command for updating a big plan milestone."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: BigPlanMilestoneUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        milestone = await uow.get_for(BigPlanMilestone).load_by_id(args.ref_id)
        big_plan = await self.load_entity(
            uow, context.user.ref_id, BigPlan, milestone.big_plan.ref_id
        )

        if args.date.should_change:
            new_date = args.date.just_the_value
            if big_plan.actionable_date and new_date < big_plan.actionable_date:
                raise InputValidationError(
                    f"Milestone date {new_date} must be after big plan's actionable date {big_plan.actionable_date}"
                )
            if big_plan.due_date and new_date > big_plan.due_date:
                raise InputValidationError(
                    f"Milestone date {new_date} must be before big plan's due date {big_plan.due_date}"
                )

        updated_milestone = milestone.update(
            context.domain_context,
            date=args.date,
            name=args.name,
        )
        await uow.get_for(BigPlanMilestone).save(updated_milestone)
        await progress_reporter.mark_updated(updated_milestone)
