"""Service for reassigning linked entities when archiving/removing a project."""

from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.life_plan.sub.aspects.service.check_cycles import (
    ProjectCheckCyclesService,
    ProjectTreeHasCyclesError,
)
from jupiter.framework.context import MutationContext
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction


class ProjectReassignChildProjectsService:
    """Service for reassigning direct children projects to the project's parent."""

    async def reassign_child_projects(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        life_plan: LifePlan,
        old_project: Project,
    ) -> None:
        """Reassign all direct children of the project to the project's parent."""
        if old_project.is_root:
            raise InputValidationError(
                "The root project cannot be processed by this service."
            )

        new_parent_project_ref_id = old_project.surely_parent_project_ref_id

        child_projects = await uow.get_for(Project).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=True,
            parent_project_ref_id=old_project.ref_id,
        )

        for child_project in child_projects:
            child_project = child_project.update(
                ctx,
                name=UpdateAction.do_nothing(),
                parent_project_ref_id=UpdateAction.change_to(new_parent_project_ref_id),
            )

            await uow.get_for(Project).save(child_project)
            await progress_reporter.mark_updated(child_project)

            try:
                await ProjectCheckCyclesService().check_for_cycles(uow, child_project)
            except ProjectTreeHasCyclesError as err:
                raise InputValidationError("The project tree has cycles.") from err
