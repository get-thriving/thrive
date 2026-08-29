"""The command for updating a project milestone."""

from jupiter.core.apps.projects.root import Project
from jupiter.core.apps.projects.sub.milestones.root import ProjectMilestone
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    use_case_args,
)


@use_case_args
class ProjectMilestoneUpdateArgs(JupiterUpdateCrownEntityArgs):
    """Project milestone update args."""

    ref_id: EntityId
    date: UpdateAction[ADate]
    name: UpdateAction[EntityName]


@mutation_use_case(WorkspaceFeature.PROJECTS)
class ProjectMilestoneUpdateUseCase(
    JupiterUpdateCrownEntityUseCase[ProjectMilestoneUpdateArgs, None]
):
    """The command for updating a project milestone."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ProjectMilestoneUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        milestone = await uow.get_for(ProjectMilestone).load_by_id(args.ref_id)
        project = await self.load_entity(
            uow, context.user.ref_id, Project, milestone.project.ref_id
        )

        if args.date.should_change:
            new_date = args.date.just_the_value
            if project.actionable_date and new_date < project.actionable_date:
                raise InputValidationError(
                    f"Milestone date {new_date} must be after project's actionable date {project.actionable_date}"
                )
            if project.due_date and new_date > project.due_date:
                raise InputValidationError(
                    f"Milestone date {new_date} must be before project's due date {project.due_date}"
                )

        updated_milestone = milestone.update(
            context.domain_context,
            date=args.date,
            name=args.name,
        )
        await uow.get_for(ProjectMilestone).save(updated_milestone)
        await progress_reporter.mark_updated(updated_milestone)
