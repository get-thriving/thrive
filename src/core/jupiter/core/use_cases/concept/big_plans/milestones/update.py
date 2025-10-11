"""The command for updating a big plan milestone."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.big_plans.big_plan import BigPlan
from jupiter.core.domain.concept.big_plans.big_plan_milestone import BigPlanMilestone
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.adate import ADate
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.base.entity_name import EntityName
from jupiter.framework_new.errors import InputValidationError
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.update_action import UpdateAction
from jupiter.framework_new.use_case import (
    ProgressReporter,
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import (
    UseCaseArgsBase,
    use_case_args,
)


@use_case_args
class BigPlanMilestoneUpdateArgs(UseCaseArgsBase):
    """Big plan milestone update args."""

    ref_id: EntityId
    date: UpdateAction[ADate]
    name: UpdateAction[EntityName]


@mutation_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanMilestoneUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[BigPlanMilestoneUpdateArgs, None]
):
    """The command for updating a big plan milestone."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: BigPlanMilestoneUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        # Load the milestone and its parent big plan
        milestone = await uow.get_for(BigPlanMilestone).load_by_id(args.ref_id)
        big_plan = await uow.get_for(BigPlan).load_by_id(milestone.big_plan.ref_id)

        # If date is being updated, validate it against big plan dates
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

        # Update the milestone
        updated_milestone = milestone.update(
            context.domain_context,
            date=args.date,
            name=args.name,
        )
        await uow.get_for(BigPlanMilestone).save(updated_milestone)
        await progress_reporter.mark_updated(updated_milestone)
