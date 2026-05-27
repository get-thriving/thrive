"""Service for reassigning linked entities when archiving/removing a goal."""

from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.life_plan.sub.goals.service.check_cycles import (
    GoalCheckCyclesService,
    GoalTreeHasCyclesError,
)
from jupiter.framework.context import DomainContext
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction


class GoalReassignChildGoalsService:
    """Service for reassigning linked entities."""

    async def reassign_child_goals(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        life_plan: LifePlan,
        old_goal: Goal,
    ) -> None:
        """Reassign all direct children of the goal to the goal's parent."""
        new_parent_goal_ref_id = old_goal.parent_goal_ref_id

        child_goals = await uow.get_for(Goal).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=True,
            parent_goal_ref_id=old_goal.ref_id,
        )

        for child_goal in child_goals:
            child_goal = child_goal.update(
                ctx,
                name=UpdateAction.do_nothing(),
                aspect_ref_id=UpdateAction.do_nothing(),
                parent_goal_ref_id=UpdateAction.change_to(new_parent_goal_ref_id),
            )

            await uow.get_for(Goal).save(child_goal)
            await progress_reporter.mark_updated(child_goal)

            try:
                await GoalCheckCyclesService().check_for_cycles(uow, child_goal)
            except GoalTreeHasCyclesError as err:
                raise InputValidationError("The goal tree has cycles.") from err
