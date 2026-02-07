"""A service that checks for cycles in the goal graph."""

from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork


class GoalTreeHasCyclesError(Exception):
    """Exception raised when the goal tree has cycles."""


class GoalCheckCyclesService:
    """A service that checks for cycles in the goal graph."""

    async def check_for_cycles(self, uow: DomainUnitOfWork, goal: Goal) -> None:
        """Check for cycles in the goal graph."""
        if goal.parent_goal_ref_id is None:
            return

        current_ref_id: EntityId | None = goal.parent_goal_ref_id

        while current_ref_id is not None:
            if current_ref_id == goal.ref_id:
                raise GoalTreeHasCyclesError
            current_goal = await uow.get_for(Goal).load_by_id(current_ref_id)
            current_ref_id = current_goal.parent_goal_ref_id
