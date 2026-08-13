"""Use case for creating time plan actitivities for todo tasks."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
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
class TimePlanAssociateWithTodoTasksArgs(JupiterUpdateCrownEntityArgs):
    """Args."""

    ref_id: EntityId
    todo_task_ref_ids: list[EntityId]
    override_existing_dates: bool
    kind: TimePlanActivityKind
    feasability: TimePlanActivityFeasability


@use_case_result
class TimePlanAssociateWithTodoTasksResult(UseCaseResultBase):
    """Result."""

    new_time_plan_activities: list[TimePlanActivity]


@mutation_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanAssociateWithTodoTasksUseCase(
    JupiterUpdateCrownEntityUseCase[
        TimePlanAssociateWithTodoTasksArgs, TimePlanAssociateWithTodoTasksResult
    ]
):
    """Use case for creating activities starting from todo tasks."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanAssociateWithTodoTasksArgs,
    ) -> TimePlanAssociateWithTodoTasksResult:
        """Execute the command's actions."""
        if len(args.todo_task_ref_ids) == 0:
            raise InputValidationError("You must specifiy some todo tasks")

        time_plan = await self.load_entity(
            uow, context.user.ref_id, TimePlan, args.ref_id
        )

        if not time_plan.allows_inbox_tasks:
            raise InputValidationError(
                "Todo tasks can only be added to daily or weekly time plans"
            )

        todo_tasks = await self.find_all_generic(
            uow,
            context.user.ref_id,
            TodoTask,
            allow_archived=False,
            ref_id=args.todo_task_ref_ids,
            minimum_access_level=AccessLevel.READER,
        )

        new_time_plan_actitivies = []

        for todo_task in todo_tasks:
            try:
                new_time_plan_activity = TimePlanActivity.new_activity_for_todo_task(
                    context.domain_context,
                    time_plan_ref_id=args.ref_id,
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
                new_time_plan_actitivies.append(new_time_plan_activity)
            except TimePlanAlreadyAssociatedWithTargetError:
                # We were already working on this todo task, no need to panic
                pass

            inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=None,
                allow_archived=False,
                owner=EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
            )
            if len(inbox_tasks) == 0:
                continue

            inbox_task = inbox_tasks[0]
            if inbox_task.allow_user_changes and (
                inbox_task.due_date is None or args.override_existing_dates
            ):
                inbox_task = inbox_task.change_due_date_via_time_plan(
                    context.domain_context, due_date=time_plan.end_date
                )
                await uow.get_for(InboxTask).save(inbox_task)

        return TimePlanAssociateWithTodoTasksResult(
            new_time_plan_activities=new_time_plan_actitivies
        )
