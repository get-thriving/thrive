"""A life plan."""

from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.life_plan.sub.chapters.root import Chapter
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
class LifePlan(TrunkEntity):
    """A project collection."""

    workspace: ParentLink

    projects = ContainsMany(Project, life_plan_ref_id=IsRefId())
    chapters = ContainsMany(Chapter, life_plan_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_life_plan(
        ctx: MutationContext,
        workspace_ref_id: EntityId,
    ) -> "LifePlan":
        """Create a life plan."""
        return LifePlan._create(
            ctx,
            workspace=ParentLink(workspace_ref_id),
        )
