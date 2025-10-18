"""Change the parent project of the project."""

from typing import cast

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.projects.project import Project
from jupiter.core.domain.concept.projects.service.check_cycles_service import (
    ProjectCheckCyclesService,
    ProjectTreeHasCyclesError,
)
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.errors import InputValidationError
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    ProgressReporter,
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ProjectChangeParentArgs(UseCaseArgsBase):
    """Project change parent args."""

    ref_id: EntityId
    parent_project_ref_id: EntityId


@mutation_use_case(WorkspaceFeature.PROJECTS)
class ProjectChangeParentUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ProjectChangeParentArgs, None]
):
    """The command for changing the parent project of a project."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ProjectChangeParentArgs,
    ) -> None:
        """Execute the command's action."""
        project = await uow.get_for(Project).load_by_id(args.ref_id)
        if project.is_root:
            raise InputValidationError("Root projects cannot have a parent project.")

        current_parent = await uow.get_for(Project).load_by_id(
            cast(EntityId, project.parent_project_ref_id)  # Null on root projects
        )
        new_parent = await uow.get_for(Project).load_by_id(args.parent_project_ref_id)

        project = project.change_parent(
            ctx=context.domain_context,
            parent_project_ref_id=args.parent_project_ref_id,
        )

        await uow.get_for(Project).save(project)
        await progress_reporter.mark_updated(project)

        current_parent = current_parent.remove_child_project(
            context.domain_context, project.ref_id
        )
        await uow.get_for(Project).save(current_parent)
        await progress_reporter.mark_updated(current_parent)

        new_parent = new_parent.add_child_project(
            context.domain_context, project.ref_id
        )
        await uow.get_for(Project).save(new_parent)
        await progress_reporter.mark_updated(new_parent)

        try:
            await ProjectCheckCyclesService().check_for_cycles(uow, project)
        except ProjectTreeHasCyclesError as err:
            raise InputValidationError("The project tree has cycles.") from err
