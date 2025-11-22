"""A project collection."""

from jupiter.core.projects.root import Project
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
class ProjectCollection(TrunkEntity):
    """A project collection."""

    workspace: ParentLink

    projects = ContainsMany(Project, project_collection_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_project_collection(
        ctx: MutationContext,
        workspace_ref_id: EntityId,
    ) -> "ProjectCollection":
        """Create a project collection."""
        return ProjectCollection._create(
            ctx,
            workspace=ParentLink(workspace_ref_id),
        )
