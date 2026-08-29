"""The command for creating a project milestone."""

from jupiter.core.apps.projects.root import Project
from jupiter.core.apps.projects.sub.milestones.root import ProjectMilestone
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class ProjectMilestoneCreateArgs(JupiterCreateCrownEntityArgs):
    """Project milestone create args."""

    project_ref_id: EntityId
    date: ADate
    name: EntityName


@use_case_result
class ProjectMilestoneCreateResult(UseCaseResultBase):
    """Project milestone create result."""

    new_project_milestone: ProjectMilestone


@mutation_use_case(WorkspaceFeature.PROJECTS)
class ProjectMilestoneCreateUseCase(
    JupiterCreateCrownEntityUseCase[
        ProjectMilestoneCreateArgs, ProjectMilestoneCreateResult
    ]
):
    """The command for creating a project milestone."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ProjectMilestoneCreateArgs,
    ) -> ProjectMilestoneCreateResult:
        """Execute the command's action."""
        project = await self.load_entity(
            uow, context.user.ref_id, Project, args.project_ref_id
        )

        if project.actionable_date and args.date < project.actionable_date:
            raise InputValidationError(
                f"Milestone date {args.date} must be after project's actionable date {project.actionable_date}"
            )

        if project.due_date and args.date > project.due_date:
            raise InputValidationError(
                f"Milestone date {args.date} must be before project's due date {project.due_date}"
            )

        new_project_milestone = ProjectMilestone.new_project_milestone(
            context.domain_context,
            project_ref_id=args.project_ref_id,
            date=args.date,
            name=args.name,
        )
        new_project_milestone = await self.create_entity(
            context.domain_context,
            uow,
            progress_reporter,
            context.user.ref_id,
            new_project_milestone,
        )

        return ProjectMilestoneCreateResult(new_project_milestone=new_project_milestone)
