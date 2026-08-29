"""The command for removing a project milestone."""

from jupiter.core.apps.projects.root import Project
from jupiter.core.apps.projects.sub.milestones.root import ProjectMilestone
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
from jupiter.framework.utils.generic_crown_remover import generic_crown_remover


@use_case_args
class ProjectMilestoneRemoveArgs(JupiterRemoveCrownEntityArgs):
    """Project milestone remove args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.PROJECTS)
class ProjectMilestoneRemoveUseCase(
    JupiterRemoveCrownEntityUseCase[ProjectMilestoneRemoveArgs, None]
):
    """The command for removing a project milestone."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ProjectMilestoneRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        milestone = await uow.get_for(ProjectMilestone).load_by_id(
            args.ref_id, allow_archived=True
        )
        await self.check_entity(
            uow,
            context.user.ref_id,
            Project,
            milestone.project.ref_id,
        )

        await generic_crown_remover(
            context.domain_context,
            uow,
            progress_reporter,
            ProjectMilestone,
            args.ref_id,
        )
