"""The command for creating a big plan milestone."""

from jupiter.core.domain.concept.big_plans.big_plan import BigPlan
from jupiter.core.domain.concept.big_plans.big_plan_milestone import BigPlanMilestone
from jupiter.framework_new.base.adateimport ADate
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.infra.generic_creator import generic_creator
from jupiter.core.domain.storage_engine import DomainUnitOfWork
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.base.entity_name import EntityName
from jupiter.framework_new.use_case import ProgressReporter
from jupiter.framework_new.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)
from jupiter.core.use_cases.infra.use_cases import (
    AppLoggedInMutationUseCaseContext,
    AppTransactionalLoggedInMutationUseCase,
    mutation_use_case,
)
from jupiter.framework_new.errors import InputValidationError


@use_case_args
class BigPlanMilestoneCreateArgs(UseCaseArgsBase):
    """Big plan milestone create args."""

    big_plan_ref_id: EntityId
    date: ADate
    name: EntityName


@use_case_result
class BigPlanMilestoneCreateResult(UseCaseResultBase):
    """Big plan milestone create result."""

    new_big_plan_milestone: BigPlanMilestone


@mutation_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanMilestoneCreateUseCase(
    AppTransactionalLoggedInMutationUseCase[
        BigPlanMilestoneCreateArgs, BigPlanMilestoneCreateResult
    ]
):
    """The command for creating a big plan milestone."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: AppLoggedInMutationUseCaseContext,
        args: BigPlanMilestoneCreateArgs,
    ) -> BigPlanMilestoneCreateResult:
        """Execute the command's action."""
        # Verify the big plan exists and get its dates
        big_plan = await uow.get_for(BigPlan).load_by_id(args.big_plan_ref_id)

        # Validate milestone date is after actionable date if it exists
        if big_plan.actionable_date and args.date < big_plan.actionable_date:
            raise InputValidationError(
                f"Milestone date {args.date} must be after big plan's actionable date {big_plan.actionable_date}"
            )

        # Validate milestone date is before due date if it exists
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
        new_big_plan_milestone = await generic_creator(
            uow, progress_reporter, new_big_plan_milestone
        )

        return BigPlanMilestoneCreateResult(
            new_big_plan_milestone=new_big_plan_milestone
        )
