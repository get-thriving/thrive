"""A habit collection."""

from jupiter.core.domain.concept.habits.habit import Habit
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    create_entity_action,
    entity,
)


@entity
class HabitCollection(TrunkEntity):
    """A habit collection."""

    workspace: ParentLink

    habits = ContainsMany(Habit, habit_collection_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_habit_collection(
        ctx: MutationContext,
        workspace_ref_id: EntityId,
    ) -> "HabitCollection":
        """Create a habit collection."""
        return HabitCollection._create(ctx, workspace=ParentLink(workspace_ref_id))
