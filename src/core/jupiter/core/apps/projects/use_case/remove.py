"""The command for removing a project."""

from jupiter.core.apps.projects.root import Project
from jupiter.core.apps.projects.service.remove import (
    ProjectRemoveService,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterRemoveCrownEntityArgs,
    JupiterRemoveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class ProjectRemoveArgs(JupiterRemoveCrownEntityArgs):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.PROJECTS)
class ProjectRemoveUseCase(JupiterRemoveCrownEntityUseCase[ProjectRemoveArgs, None]):
    """The command for removing a project."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ProjectRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        await self.load_entity(
            uow,
            context.user.ref_id,
            Project,
            args.ref_id,
        )

        await ProjectRemoveService().remove(
            context.domain_context,
            uow,
            progress_reporter,
            context.workspace,
            args.ref_id,
        )
