"""A service that computes the depth of a goal from the root goal."""

from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork


class GoalComputeDepthFromRootService:
    """A service that computes the depth of a goal from the root goal.

    A goal with no parent has depth 0, its children depth 1, etc.
    """

    async def do_it(self, uow: DomainUnitOfWork, goal: Goal) -> int:
        """Compute the depth of a goal from the root goal."""
        depth = 0
        current_ref_id: EntityId | None = goal.parent_goal_ref_id
        while current_ref_id is not None:
            depth += 1
            current_goal = await uow.get_for(Goal).load_by_id(current_ref_id)
            current_ref_id = current_goal.parent_goal_ref_id
        return depth
