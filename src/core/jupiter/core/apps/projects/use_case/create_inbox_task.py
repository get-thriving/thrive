"""The command for creating an inbox task for a project."""

from jupiter.core.apps.projects.root import Project
from jupiter.core.apps.projects.stats import ProjectStatsRepository
from jupiter.core.apps.time_plans.root import TimePlan
from jupiter.core.apps.time_plans.sub.activity.feasability import (
    TimePlanActivityFeasability,
)
from jupiter.core.apps.time_plans.sub.activity.kind import (
    TimePlanActivityKind,
)
from jupiter.core.apps.time_plans.sub.activity.root import (
    TimePlanActivity,
    TimePlanAlreadyAssociatedWithTargetError,
)
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.name import InboxTaskName
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.inbox_tasks.status import InboxTaskStatus
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import (
    WorkspaceFeature,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
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
class ProjectCreateInboxTaskArgs(JupiterCreateCrownEntityArgs):
    """ProjectCreateInboxTask args."""

    project_ref_id: EntityId
    name: InboxTaskName
    time_plan_ref_id: EntityId | None
    time_plan_activity_kind: TimePlanActivityKind | None
    time_plan_activity_feasability: TimePlanActivityFeasability | None
    is_key: bool
    eisen: Eisen
    difficulty: Difficulty
    actionable_date: ADate | None
    due_date: ADate | None


@use_case_result
class ProjectCreateInboxTaskResult(UseCaseResultBase):
    """ProjectCreateInboxTask result."""

    new_inbox_task: InboxTask
    new_time_plan_activity: TimePlanActivity | None


@mutation_use_case(WorkspaceFeature.PROJECTS)
class ProjectCreateInboxTaskUseCase(
    JupiterCreateCrownEntityUseCase[
        ProjectCreateInboxTaskArgs, ProjectCreateInboxTaskResult
    ]
):
    """The command for creating an inbox task for a project."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ProjectCreateInboxTaskArgs,
    ) -> ProjectCreateInboxTaskResult:
        """Execute the command's action."""
        project = await self.load_entity(
            uow, context.user.ref_id, Project, args.project_ref_id
        )

        time_plan: TimePlan | None = None
        if args.time_plan_ref_id:
            time_plan = await self.load_entity(
                uow, context.user.ref_id, TimePlan, args.time_plan_ref_id
            )

        # Inbox tasks belong with the project they describe, so a writer on a
        # shared plan files the task in the plan owner's workspace.
        owner_workspace_ref_id = await self.find_entity_workspace(uow, project)
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            owner_workspace_ref_id,
        )

        new_inbox_task = InboxTask.new_inbox_task_for_project(
            ctx=context.domain_context,
            inbox_task_collection_ref_id=inbox_task_collection.ref_id,
            name=args.name,
            status=InboxTaskStatus.NOT_STARTED,
            is_key=args.is_key,
            eisen=args.eisen,
            difficulty=args.difficulty,
            actionable_date=args.actionable_date,
            due_date=args.due_date,
            project_ref_id=project.ref_id,
            project_actionable_date=project.actionable_date,
            project_due_date=project.due_date,
        )

        new_inbox_task = await self.create_entity(
            context.domain_context,
            uow,
            progress_reporter,
            context.user.ref_id,
            new_inbox_task,
        )

        new_time_plan_activity = None
        if time_plan:
            time_plan_activity_kind = args.time_plan_activity_kind
            time_plan_activity_feasability = args.time_plan_activity_feasability
            if not time_plan_activity_kind:
                raise InputValidationError("An activity kind is required")
            if not time_plan_activity_feasability:
                raise InputValidationError("An activity feasability is required")
            new_time_plan_activity = TimePlanActivity.new_activity_for_inbox_task(
                context.domain_context,
                time_plan_ref_id=time_plan.ref_id,
                inbox_task_ref_id=new_inbox_task.ref_id,
                kind=time_plan_activity_kind,
                feasability=time_plan_activity_feasability,
            )
            new_time_plan_activity = await self.create_entity(
                context.domain_context,
                uow,
                progress_reporter,
                context.user.ref_id,
                new_time_plan_activity,
            )

            try:
                new_project_time_plan_activity = (
                    TimePlanActivity.new_activity_for_project(
                        context.domain_context,
                        time_plan_ref_id=time_plan.ref_id,
                        project_ref_id=project.ref_id,
                        kind=time_plan_activity_kind,
                        feasability=time_plan_activity_feasability,
                    )
                )
                new_project_time_plan_activity = await self.create_entity(
                    context.domain_context,
                    uow,
                    progress_reporter,
                    context.user.ref_id,
                    new_project_time_plan_activity,
                )
            except TimePlanAlreadyAssociatedWithTargetError:
                pass

        await uow.get(ProjectStatsRepository).mark_add_inbox_task(
            project.ref_id,
        )

        return ProjectCreateInboxTaskResult(
            new_inbox_task=new_inbox_task, new_time_plan_activity=new_time_plan_activity
        )
