"""Use case for removing a goal."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.life_plan.sub.goals.service.unlink_entities import (
    GoalUnlinkEntitiesService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_crown_remover import generic_crown_remover


@use_case_args
class GoalRemoveArgs(UseCaseArgsBase):
    """Goal remove args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class GoalRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[GoalRemoveArgs, None]
):
    """The command for removing a goal."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: GoalRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        life_plan = await uow.get_for(LifePlan).load_by_parent(context.workspace.ref_id)
        goal = await uow.get_for(Goal).load_by_id(args.ref_id)

        await GoalUnlinkEntitiesService().unlink_entities(
            context.domain_context,
            uow,
            progress_reporter,
            life_plan,
            goal,
        )

        await generic_crown_remover(
            context.domain_context, uow, progress_reporter, Goal, args.ref_id
        )
