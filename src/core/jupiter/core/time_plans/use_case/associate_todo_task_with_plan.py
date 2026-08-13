"""Use case for creating time plan activities for a todo task."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.status.service.load_for_acl import (
    LoadForAclService,
)
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.time_plans.root import TimePlan
from jupiter.core.time_plans.sub.activity.feasability import (
    TimePlanActivityFeasability,
)
from jupiter.core.time_plans.sub.activity.kind import (
    TimePlanActivityKind,
)
from jupiter.core.time_plans.sub.activity.root import (
    TimePlanActivity,
    TimePlanAlreadyAssociatedWithTargetError,
)
from jupiter.core.todo.root import TodoTask
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
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
class TimePlanAssociateTodoTaskWithPlanArgs(JupiterCreateCrownEntityArgs):
    """Args."""

    todo_task_ref_id: EntityId
    time_plan_ref_ids: list[EntityId]
    kind: TimePlanActivityKind
    feasability: TimePlanActivityFeasability


@use_case_result
class TimePlanAssociateTodoTaskWithPlanResult(UseCaseResultBase):
    """Result."""

    new_time_plan_activities: list[TimePlanActivity]


@mutation_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanAssociateTodoTaskWithPlanUseCase(
    JupiterCreateCrownEntityUseCase[
        TimePlanAssociateTodoTaskWithPlanArgs, TimePlanAssociateTodoTaskWithPlanResult
    ]
):
    """Use case for creating activities starting from a todo task."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanAssociateTodoTaskWithPlanArgs,
    ) -> TimePlanAssociateTodoTaskWithPlanResult:
        """Execute the command's actions."""
        if len(args.time_plan_ref_ids) == 0:
            raise InputValidationError("You must specify some time plans")

        todo_task = await LoadForAclService().do_it(
            uow,
            TodoTask,
            args.todo_task_ref_id,
            context.user.ref_id,
            AccessLevel.READER,
        )

        time_plans = await self.find_all_entities(
            uow,
            context.user.ref_id,
            TimePlan,
            args.time_plan_ref_ids,
            allow_archived=False,
        )

        for time_plan in time_plans:
            if not time_plan.allows_inbox_tasks:
                raise InputValidationError(
                    f"Time plan {time_plan.name} does not allow todo task activities"
                )

        latest_time_plan = max(time_plans, key=lambda x: x.end_date)

        new_time_plan_activities = []

        for time_plan in time_plans:
            try:
                new_time_plan_activity = TimePlanActivity.new_activity_for_todo_task(
                    context.domain_context,
                    time_plan_ref_id=time_plan.ref_id,
                    todo_task_ref_id=todo_task.ref_id,
                    kind=args.kind,
                    feasability=args.feasability,
                )
                new_time_plan_activity = await self.create_entity(
                    context.domain_context,
                    uow,
                    progress_reporter,
                    context.user.ref_id,
                    new_time_plan_activity,
                )
                new_time_plan_activities.append(new_time_plan_activity)
            except TimePlanAlreadyAssociatedWithTargetError:
                # We were already working on this plan, no need to panic
                pass

        inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
            parent_ref_id=None,
            allow_archived=False,
            owner=EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
        )

        if len(inbox_tasks) > 0:
            inbox_task = inbox_tasks[0]
            if inbox_task.allow_user_changes and inbox_task.due_date is None:
                inbox_task = inbox_task.change_due_date_via_time_plan(
                    context.domain_context, due_date=latest_time_plan.end_date
                )
                await uow.get_for(InboxTask).save(inbox_task)

        return TimePlanAssociateTodoTaskWithPlanResult(
            new_time_plan_activities=new_time_plan_activities
        )
