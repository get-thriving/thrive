"""Use case for loading project milestones."""

from jupiter.core.apps.projects.root import Project
from jupiter.core.apps.projects.sub.milestones.root import (
    ProjectMilestone,
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
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class ProjectMilestoneLoadArgs(JupiterLoadCrownEntityArgs):
    """ProjectMilestoneLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class ProjectMilestoneLoadResult(UseCaseResultBase):
    """ProjectMilestoneLoadResult."""

    project_milestone: ProjectMilestone


@readonly_use_case(WorkspaceFeature.PROJECTS)
class ProjectMilestoneLoadUseCase(
    JupiterLoadCrownEntityUseCase[ProjectMilestoneLoadArgs, ProjectMilestoneLoadResult]
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
        await self.check_entity(
            uow,
            context.user.ref_id,
            Project,
            project_milestone.project.ref_id,
            allow_archived,
        )

        return ProjectMilestoneLoadResult(
            project_milestone=project_milestone,
        )
