"""The command for archiving a project milestone."""

from jupiter.core.apps.projects.root import Project
from jupiter.core.apps.projects.sub.milestones.root import ProjectMilestone
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterArchiveCrownEntityArgs,
    JupiterArchiveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args
from jupiter.framework.utils.generic_crown_archiver import generic_crown_archiver


@use_case_args
class ProjectMilestoneArchiveArgs(JupiterArchiveCrownEntityArgs):
    """Project milestone archive args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.PROJECTS)
class ProjectMilestoneArchiveUseCase(
    JupiterArchiveCrownEntityUseCase[ProjectMilestoneArchiveArgs, None]
):
    """The command for archiving a project milestone."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ProjectMilestoneArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        milestone = await uow.get_for(ProjectMilestone).load_by_id(
            args.ref_id, allow_archived=True
        )
        await self.check_entity(
            uow, context.user.ref_id, Project, milestone.project.ref_id
        )

        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            ProjectMilestone,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
