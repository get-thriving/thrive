"""A service that computes the depth of a project from the root project."""

from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork


class ProjectComputeDepthFromRootService:
    """A service that computes the depth of a project from the root project.

    Root project has depth 0, its children depth 1, etc.
    """

    async def do_it(self, uow: DomainUnitOfWork, project: Project) -> int:
        """Compute the depth of a project from the root project."""
        depth = 0
        current_ref_id: EntityId | None = project.parent_project_ref_id
        while current_ref_id is not None:
            depth += 1
            current_project = await uow.get_for(Project).load_by_id(current_ref_id)
            current_ref_id = current_project.parent_project_ref_id
        return depth
