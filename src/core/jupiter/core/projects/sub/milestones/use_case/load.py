"""Use case for loading project milestones."""

from jupiter.core.projects.sub.milestones.root import (
    ProjectMilestone,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class ProjectMilestoneLoadArgs(UseCaseArgsBase):
    """ProjectMilestoneLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class ProjectMilestoneLoadResult(UseCaseResultBase):
    """ProjectMilestoneLoadResult."""

    project_milestone: ProjectMilestone


@readonly_use_case(WorkspaceFeature.PROJECTS)
class ProjectMilestoneLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        ProjectMilestoneLoadArgs, ProjectMilestoneLoadResult
    ]
):
    """The use case for loading a particular project milestone."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ProjectMilestoneLoadArgs,
    ) -> ProjectMilestoneLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        project_milestone = await uow.get_for(ProjectMilestone).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )

        return ProjectMilestoneLoadResult(
            project_milestone=project_milestone,
        )
