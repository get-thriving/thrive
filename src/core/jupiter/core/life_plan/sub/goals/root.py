"""A goal in a life plan."""

from jupiter.core.common.sub.notes.domain import NoteDomain
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.life_plan.sub.goals.name import GoalName
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    IsRefId,
    LeafEntity,
    OwnsAtMostOne,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.update_action import UpdateAction


@entity
class Goal(LeafEntity):
    """A goal in a life plan."""

    life_plan: ParentLink
    name: GoalName
    project_ref_id: EntityId

    note = OwnsAtMostOne(Note, domain=NoteDomain.GOAL, source_entity_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_goal(
        ctx: MutationContext,
        life_plan_ref_id: EntityId,
        name: GoalName,
        project_ref_id: EntityId,
    ) -> "Goal":
        """Create a goal."""
        return Goal._create(
            ctx,
            life_plan=ParentLink(life_plan_ref_id),
            name=name,
            project_ref_id=project_ref_id,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        name: UpdateAction[GoalName],
        project_ref_id: UpdateAction[EntityId],
    ) -> "Goal":
        """Update a goal."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            project_ref_id=project_ref_id.or_else(self.project_ref_id),
        )
