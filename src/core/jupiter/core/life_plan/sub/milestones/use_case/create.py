"""The command for creating a milestone."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.life_plan.sub.milestones.name import MilestoneName
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class MilestoneCreateArgs(UseCaseArgsBase):
    """Milestone create args."""

    name: MilestoneName
    date: ADate
    project_ref_id: EntityId


@use_case_result
class MilestoneCreateResult(UseCaseResultBase):
    """Milestone create results."""

    new_milestone: Milestone


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class MilestoneCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        MilestoneCreateArgs, MilestoneCreateResult
    ]
):
    """The command for creating a milestone."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: MilestoneCreateArgs,
    ) -> MilestoneCreateResult:
        """Execute the command's action."""
        workspace = context.workspace

        life_plan = await uow.get_for(LifePlan).load_by_parent(
            workspace.ref_id,
        )

        if args.date < life_plan.birthday_date:
            raise InputValidationError(
                f"Milestone date {args.date} must be after life plan's birthday {life_plan.birthday_date}"
            )
        if args.date > life_plan.end_date:
            raise InputValidationError(
                f"Milestone date {args.date} must be before life plan's end date {life_plan.end_date}"
            )

        project = await uow.get_for(Project).load_by_id(args.project_ref_id)

        new_milestone = Milestone.new_milestone(
            ctx=context.domain_context,
            life_plan_ref_id=life_plan.ref_id,
            name=args.name,
            date=args.date,
            project_ref_id=project.ref_id,
        )

        new_milestone = await uow.get_for(Milestone).create(new_milestone)
        await progress_reporter.mark_created(new_milestone)

        return MilestoneCreateResult(new_milestone=new_milestone)
