"""The command for updating a goal."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.life_plan.sub.goals.name import GoalName
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class GoalUpdateArgs(UseCaseArgsBase):
    """Goal update args."""

    ref_id: EntityId
    name: UpdateAction[GoalName]
    project_ref_id: UpdateAction[EntityId]


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class GoalUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[GoalUpdateArgs, None]
):
    """The command for updating a goal."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: GoalUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        goal = await uow.get_for(Goal).load_by_id(args.ref_id)

        _ = await uow.get_for(Project).load_by_id(
            args.project_ref_id.or_else(goal.project_ref_id)
        )

        goal = goal.update(
            ctx=context.domain_context,
            name=args.name,
            project_ref_id=args.project_ref_id,
        )

        await uow.get_for(Goal).save(goal)
        await progress_reporter.mark_updated(goal)
