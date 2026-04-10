"""A goal in a life plan."""

from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.life_plan.sub.goals.name import GoalName
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsEntityLinkStd,
    IsRefId,
    LeafEntity,
    OwnsAtMostOne,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.update_action import UpdateAction

MAX_GOAL_DEPTH_FROM_ROOT = 5


@entity("LifePlan")
class Goal(LeafEntity):
    """A goal in a life plan."""

    life_plan: ParentLink
    name: GoalName
    aspect_ref_id: EntityId
    parent_goal_ref_id: EntityId | None

    tag_link = OwnsAtMostOne(
        TagLink, namespace=TagNamespace.GOAL, source_entity_ref_id=IsRefId()
    )
    note = OwnsAtMostOne(
        Note, owner=IsEntityLinkStd(NamedEntityTag.GOAL.value)
    )

    @staticmethod
    @create_entity_action
    def new_goal(
        ctx: DomainContext,
        life_plan_ref_id: EntityId,
        name: GoalName,
        aspect_ref_id: EntityId,
        parent_goal_ref_id: EntityId | None,
    ) -> "Goal":
        """Create a goal."""
        return Goal._create(
            ctx,
            life_plan=ParentLink(life_plan_ref_id),
            name=name,
            aspect_ref_id=aspect_ref_id,
            parent_goal_ref_id=parent_goal_ref_id,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[GoalName],
        aspect_ref_id: UpdateAction[EntityId],
        parent_goal_ref_id: UpdateAction[EntityId | None],
    ) -> "Goal":
        """Update a goal."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            aspect_ref_id=aspect_ref_id.or_else(self.aspect_ref_id),
            parent_goal_ref_id=parent_goal_ref_id.or_else(self.parent_goal_ref_id),
        )
