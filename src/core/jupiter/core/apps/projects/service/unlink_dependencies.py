"""A service for unlinking a project from the projects that depend on it."""

from jupiter.core.apps.projects.root import Project
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction


class ProjectUnlinkDependenciesService:
    """A service for unlinking a project from the projects that depend on it."""

    async def unlink_dependencies(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        project: Project,
    ) -> None:
        """Drop the project from the dependencies of every other project.

        Callers must have already authorized write access to the project being
        unlinked. The projects that depend on it live in the same collection
        and are updated without a separate ACL check each.
        """
        # Dependencies are a list in a JSON column, so there's nothing to filter
        # on in the query - the whole collection is scanned instead.
        all_projects = await uow.get_for(Project).find_all_generic(
            parent_ref_id=project.project_collection.ref_id,
            allow_archived=True,
        )

        for other_project in all_projects:
            if project.ref_id not in other_project.dependency_ref_ids:
                continue

            updated_project = other_project.update(
                ctx,
                name=UpdateAction.do_nothing(),
                status=UpdateAction.do_nothing(),
                aspect_ref_id=UpdateAction.do_nothing(),
                chapter_ref_id=UpdateAction.do_nothing(),
                goal_ref_id=UpdateAction.do_nothing(),
                is_key=UpdateAction.do_nothing(),
                eisen=UpdateAction.do_nothing(),
                difficulty=UpdateAction.do_nothing(),
                actionable_date=UpdateAction.do_nothing(),
                due_date=UpdateAction.do_nothing(),
                dependency_ref_ids=UpdateAction.change_to(
                    [
                        dependency_ref_id
                        for dependency_ref_id in other_project.dependency_ref_ids
                        if dependency_ref_id != project.ref_id
                    ]
                ),
            )
            await uow.get_for(Project).save(updated_project)
            await progress_reporter.mark_updated(updated_project)
