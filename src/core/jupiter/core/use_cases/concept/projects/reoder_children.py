"""Reorder the children of a project."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.projects.project import Project
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.errors import InputValidationError
from jupiter.framework_new.progress_reporter.reporter import ProgressReporter
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ProjectReorderChildrenArgs(UseCaseArgsBase):
    """Project reorder children args."""

    ref_id: EntityId
    new_order_of_child_projects: list[EntityId]


@mutation_use_case(WorkspaceFeature.PROJECTS)
class ProjectReorderChildrenUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ProjectReorderChildrenArgs, None]
):
    """Reorder the children of a project."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ProjectReorderChildrenArgs,
    ) -> None:
        """Execute the command's action."""
        project = await uow.get_for(Project).load_by_id(args.ref_id)
        child_projects = await uow.get_for(Project).find_all_generic(
            parent_ref_id=project.project_collection.ref_id,
            allow_archived=False,
            parent_project_ref_id=args.ref_id,
        )

        child_project_ref_ids = {child.ref_id for child in child_projects}
        if set(args.new_order_of_child_projects) != child_project_ref_ids:
            raise InputValidationError(
                "The new order of child projects does not match the actual child projects."
            )

        project = project.reorder_child_projects(
            ctx=context.domain_context,
            new_order=args.new_order_of_child_projects,
        )

        await uow.get_for(Project).save(project)
        await progress_reporter.mark_updated(project)
