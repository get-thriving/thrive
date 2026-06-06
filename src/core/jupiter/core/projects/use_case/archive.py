"""The command for archiving a project."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.projects.root import Project
from jupiter.core.projects.service.archive import (
    ProjectArchiveService,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ProjectArchiveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.PROJECTS)
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
        project = await uow.get_for(Project).load_by_id(args.ref_id)

        await ProjectArchiveService().do_it(
            context.domain_context,
            uow,
            progress_reporter,
            project,
            JupiterArchivalReason.USER,
        )
