"""Use case for archiving a project."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.life_plan.sub.aspects.service.reassign_linked_entities import (
    ProjectReassignLinkedEntitiesService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_crown_archiver import generic_crown_archiver


@use_case_args
class ProjectArchiveArgs(UseCaseArgsBase):
    """Project archive args."""

    ref_id: EntityId
    backup_project_ref_id: EntityId | None


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class ProjectArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ProjectArchiveArgs, None]
):
    """The command for archiving a project."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ProjectArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace

        project = await uow.get_for(Project).load_by_id(args.ref_id)

        if project.is_root:
            raise InputValidationError("The root project cannot be archived")

        new_project = await uow.get_for(Project).load_by_id(
            args.backup_project_ref_id or project.surely_parent_project_ref_id
        )

        await ProjectReassignLinkedEntitiesService().reassign_linked_entities(
            context.domain_context,
            uow,
            progress_reporter,
            workspace,
            project,
            new_project,
        )

        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            Project,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
