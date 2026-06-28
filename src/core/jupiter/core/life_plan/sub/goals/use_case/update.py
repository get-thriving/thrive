"""The command for updating a goal."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.aspects.root import Aspect
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
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class GoalUpdateArgs(JupiterUpdateCrownEntityArgs):
    """Goal update args."""

    ref_id: EntityId
    name: UpdateAction[GoalName]
    aspect_ref_id: UpdateAction[EntityId]
    parent_goal_ref_id: UpdateAction[EntityId | None] = UpdateAction.do_nothing()


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class GoalUpdateUseCase(
    JupiterUpdateCrownEntityUseCase[GoalUpdateArgs, None]
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
        goal = await self.load_entity(uow, context.user.ref_id, Goal, args.ref_id)

        aspect_ref_id = args.aspect_ref_id.or_else(goal.aspect_ref_id)
        if args.aspect_ref_id.should_change:
            _ = await self.load_entity(uow, context.user.ref_id, Aspect, aspect_ref_id)
        else:
            _ = await uow.get_for(Aspect).load_by_id(aspect_ref_id)

        new_parent_goal_ref_id = args.parent_goal_ref_id.or_else(
            goal.parent_goal_ref_id
        )
        if new_parent_goal_ref_id is not None:
            if args.parent_goal_ref_id.should_change:
                parent_goal = await self.load_entity(
                    uow, context.user.ref_id, Goal, new_parent_goal_ref_id
                )
            else:
                parent_goal = await uow.get_for(Goal).load_by_id(new_parent_goal_ref_id)
            parent_depth = await GoalComputeDepthFromRootService().do_it(
                uow, parent_goal
            )
            if parent_depth + 1 >= MAX_GOAL_DEPTH_FROM_ROOT:
                raise InputValidationError(
                    f"Cannot move a goal deeper than {MAX_GOAL_DEPTH_FROM_ROOT} levels from the root."
                )

        goal = goal.update(
            ctx=context.domain_context,
            name=args.name,
            aspect_ref_id=args.aspect_ref_id,
            parent_goal_ref_id=args.parent_goal_ref_id,
        )

        await uow.get_for(Goal).save(goal)
        await progress_reporter.mark_updated(goal)

        try:
            await GoalCheckCyclesService().check_for_cycles(uow, goal)
        except GoalTreeHasCyclesError as err:
            raise InputValidationError("The goal tree has cycles.") from err
