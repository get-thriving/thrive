"""A service that checks for cycles in the project dependency graph."""

from jupiter.core.apps.projects.root import Project
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork


class ProjectDependenciesHaveCyclesError(Exception):
    """Exception raised when the project dependency graph has cycles."""


class ProjectCheckCyclesService:
    """A service that checks for cycles in the project dependency graph."""

    async def check_for_cycles(self, uow: DomainUnitOfWork, project: Project) -> None:
        """Check for cycles in the project dependency graph."""
        # Dependencies form a graph and not a tree, so this walks it one level
        # at a time, out from the project, until it either comes back to the
        # project or runs out of new ones to look at.
        seen: set[EntityId] = {project.ref_id}
        to_visit = list(project.dependency_ref_ids)

        while to_visit:
            if project.ref_id in to_visit:
                raise ProjectDependenciesHaveCyclesError

            next_ref_ids = [ref_id for ref_id in to_visit if ref_id not in seen]
            if not next_ref_ids:
                return
            seen.update(next_ref_ids)

            # A dependency that no longer exists just drops out here.
            dependencies = await uow.get_for(Project).find_all_generic(
                allow_archived=True,
                ref_id=next_ref_ids,
            )
            to_visit = [
                dependency_ref_id
                for dependency in dependencies
                for dependency_ref_id in dependency.dependency_ref_ids
            ]
