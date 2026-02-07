"""The command for creating a goal."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.life_plan.sub.goals.name import GoalName
from jupiter.core.life_plan.sub.goals.root import MAX_GOAL_DEPTH_FROM_ROOT, Goal
from jupiter.core.life_plan.sub.goals.service.check_cycles import (
    GoalCheckCyclesService,
    GoalTreeHasCyclesError,
)
from jupiter.core.life_plan.sub.goals.service.compute_depth_from_root import (
    GoalComputeDepthFromRootService,
)
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
class GoalCreateArgs(UseCaseArgsBase):
    """Goal create args."""

    name: GoalName
    project_ref_id: EntityId
    parent_goal_ref_id: EntityId | None = None


@use_case_result
class GoalCreateResult(UseCaseResultBase):
    """Goal create results."""

    new_goal: Goal


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class GoalCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[GoalCreateArgs, GoalCreateResult]
):
    """The command for creating a goal."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: GoalCreateArgs,
    ) -> GoalCreateResult:
        """Execute the command's action."""
        workspace = context.workspace

        life_plan = await uow.get_for(LifePlan).load_by_parent(
            workspace.ref_id,
        )

        project = await uow.get_for(Project).load_by_id(args.project_ref_id)

        if args.parent_goal_ref_id is not None:
            parent_goal = await uow.get_for(Goal).load_by_id(args.parent_goal_ref_id)
            parent_depth = await GoalComputeDepthFromRootService().do_it(
                uow, parent_goal
            )
            if parent_depth + 1 >= MAX_GOAL_DEPTH_FROM_ROOT:
                raise InputValidationError(
                    f"Cannot create a goal deeper than {MAX_GOAL_DEPTH_FROM_ROOT} levels from the root."
                )

        new_goal = Goal.new_goal(
            ctx=context.domain_context,
            life_plan_ref_id=life_plan.ref_id,
            name=args.name,
            project_ref_id=project.ref_id,
            parent_goal_ref_id=args.parent_goal_ref_id,
        )

        new_goal = await uow.get_for(Goal).create(new_goal)
        await progress_reporter.mark_created(new_goal)

        try:
            await GoalCheckCyclesService().check_for_cycles(uow, new_goal)
        except GoalTreeHasCyclesError as err:
            raise InputValidationError("The goal tree has cycles.") from err

        return GoalCreateResult(new_goal=new_goal)
