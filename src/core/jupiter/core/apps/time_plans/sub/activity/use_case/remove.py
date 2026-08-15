"""Use case for removing a time plan activity."""

from jupiter.core.app import AppCore
from jupiter.core.apps.big_plans.root import BigPlan
from jupiter.core.apps.chores.root import Chore
from jupiter.core.apps.habits.root import Habit
from jupiter.core.apps.time_plans.sub.activity.root import TimePlanActivity
from jupiter.core.apps.todo.root import TodoTask
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.root import InboxTaskRepository
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterRemoveCrownEntityArgs,
    JupiterRemoveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args
from jupiter.framework.utils.generic_crown_remover import generic_crown_remover


@use_case_args
class TimePlanActivityRemoveArgs(JupiterRemoveCrownEntityArgs):
    """Args."""

    ref_id: EntityId


@mutation_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanActivityRemoveUseCase(
    JupiterRemoveCrownEntityUseCase[TimePlanActivityRemoveArgs, None]
):
    """Use case for removing a time plan activity."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanActivityRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace
        activity = await self.load_entity(
            uow, context.user.ref_id, TimePlanActivity, args.ref_id
        )

        if activity.is_target_big_plan:
            await self.check_entity(
                uow, context.user.ref_id, BigPlan, activity.target.ref_id
            )
            await uow.get_for(InboxTaskCollection).load_by_parent(workspace.ref_id)
            inbox_tasks = await uow.get(
                InboxTaskRepository
            ).find_all_for_owner_created_desc(
                allow_archived=True,
                owner=EntityLink.std(
                    NamedEntityTag.BIG_PLAN.value, activity.target.ref_id
                ),
            )
            if len(inbox_tasks) > 0:
                inbox_task_activities = await self.find_all_generic(
                    uow,
                    context.user.ref_id,
                    TimePlanActivity,
                    parent_ref_id=activity.parent_ref_id,
                    allow_archived=False,
                    target=[
                        EntityLink.std("InboxTask", it.ref_id) for it in inbox_tasks
                    ],
                )
                for inbox_task_activity in inbox_task_activities:
                    await generic_crown_remover(
                        context.domain_context,
                        uow,
                        progress_reporter,
                        TimePlanActivity,
                        inbox_task_activity.ref_id,
                    )

        if activity.is_target_todo_task:
            await self.check_entity(
                uow, context.user.ref_id, TodoTask, activity.target.ref_id
            )
            await uow.get_for(InboxTaskCollection).load_by_parent(workspace.ref_id)
            inbox_tasks = await uow.get(
                InboxTaskRepository
            ).find_all_for_owner_created_desc(
                allow_archived=True,
                owner=EntityLink.std(
                    NamedEntityTag.TODO_TASK.value, activity.target.ref_id
                ),
            )
            if len(inbox_tasks) > 0:
                inbox_task_activities = await self.find_all_generic(
                    uow,
                    context.user.ref_id,
                    TimePlanActivity,
                    parent_ref_id=activity.parent_ref_id,
                    allow_archived=False,
                    target=[
                        EntityLink.std("InboxTask", it.ref_id) for it in inbox_tasks
                    ],
                )
                for inbox_task_activity in inbox_task_activities:
                    await generic_crown_remover(
                        context.domain_context,
                        uow,
                        progress_reporter,
                        TimePlanActivity,
                        inbox_task_activity.ref_id,
                    )

        if activity.is_target_habit:
            await self.check_entity(
                uow, context.user.ref_id, Habit, activity.target.ref_id
            )
            await uow.get_for(InboxTaskCollection).load_by_parent(workspace.ref_id)
            inbox_tasks = await uow.get(
                InboxTaskRepository
            ).find_all_for_owner_created_desc(
                allow_archived=True,
                owner=EntityLink.std(
                    NamedEntityTag.HABIT.value, activity.target.ref_id
                ),
            )
            if len(inbox_tasks) > 0:
                inbox_task_activities = await self.find_all_generic(
                    uow,
                    context.user.ref_id,
                    TimePlanActivity,
                    parent_ref_id=activity.parent_ref_id,
                    allow_archived=False,
                    target=[
                        EntityLink.std("InboxTask", it.ref_id) for it in inbox_tasks
                    ],
                )
                for inbox_task_activity in inbox_task_activities:
                    await generic_crown_remover(
                        context.domain_context,
                        uow,
                        progress_reporter,
                        TimePlanActivity,
                        inbox_task_activity.ref_id,
                    )

        if activity.is_target_chore:
            await self.check_entity(
                uow, context.user.ref_id, Chore, activity.target.ref_id
            )
            await uow.get_for(InboxTaskCollection).load_by_parent(workspace.ref_id)
            inbox_tasks = await uow.get(
                InboxTaskRepository
            ).find_all_for_owner_created_desc(
                allow_archived=True,
                owner=EntityLink.std(
                    NamedEntityTag.CHORE.value, activity.target.ref_id
                ),
            )
            if len(inbox_tasks) > 0:
                inbox_task_activities = await self.find_all_generic(
                    uow,
                    context.user.ref_id,
                    TimePlanActivity,
                    parent_ref_id=activity.parent_ref_id,
                    allow_archived=False,
                    target=[
                        EntityLink.std("InboxTask", it.ref_id) for it in inbox_tasks
                    ],
                )
                for inbox_task_activity in inbox_task_activities:
                    await generic_crown_remover(
                        context.domain_context,
                        uow,
                        progress_reporter,
                        TimePlanActivity,
                        inbox_task_activity.ref_id,
                    )

        await generic_crown_remover(
            context.domain_context,
            uow,
            progress_reporter,
            TimePlanActivity,
            args.ref_id,
        )
