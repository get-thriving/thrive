"""Use case for loading projects."""

from jupiter.core.apps.projects.root import Project
from jupiter.core.apps.projects.service.load import (
    ProjectLoadResult,
    ProjectLoadService,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    use_case_args,
)

__all__ = ["ProjectLoadArgs", "ProjectLoadResult", "ProjectLoadUseCase"]


@use_case_args
class ProjectLoadArgs(JupiterLoadCrownEntityArgs):
    """ProjectLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@readonly_use_case(WorkspaceFeature.PROJECTS)
class ProjectLoadUseCase(
    JupiterLoadCrownEntityUseCase[ProjectLoadArgs, ProjectLoadResult]
):
    """The use case for loading a particular project."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ProjectLoadArgs,
    ) -> ProjectLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        workspace = context.workspace
        project = await self.load_entity(
            uow,
            context.user.ref_id,
            Project,
            args.ref_id,
            allow_archived,
        )

        return await ProjectLoadService().do_it(
            uow,
            workspace.ref_id,
            project,
            user_ref_id=context.user.ref_id,
            allow_archived=allow_archived,
        )
