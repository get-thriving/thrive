"""Use case for loading a time plan activity activity."""

from jupiter.core.app import AppCore
from jupiter.core.apps.chores.root import Chore
from jupiter.core.apps.chores.service.load import ChoreLoadResult, ChoreLoadService
from jupiter.core.apps.habits.root import Habit
from jupiter.core.apps.habits.service.load import HabitLoadResult, HabitLoadService
from jupiter.core.apps.projects.root import Project
from jupiter.core.apps.projects.service.load import (
    ProjectLoadResult,
    ProjectLoadService,
)
from jupiter.core.apps.time_plans.sub.activity.root import TimePlanActivity
from jupiter.core.apps.todo.root import TodoTask
from jupiter.core.apps.todo.service.load import TodoTaskLoadResult, TodoTaskLoadService
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.inbox_tasks.service.load import (
    InboxTaskLoadResult,
    InboxTaskLoadService,
)
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
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
class TimePlanActivityLoadArgs(JupiterLoadCrownEntityArgs):
    """TimePlanActivityLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class TimePlanActivityLoadResult(UseCaseResultBase):
    """TimePlanActivityLoadResult."""

    time_plan_activity: TimePlanActivity
    target_inbox_task: InboxTask | None
    target_inbox_task_info: InboxTaskLoadResult | None
    target_project: Project | None
    target_project_info: ProjectLoadResult | None
    target_todo_task: TodoTask | None
    target_todo_task_info: TodoTaskLoadResult | None
    target_habit: Habit | None
    target_habit_info: HabitLoadResult | None
    target_chore: Chore | None
    target_chore_info: ChoreLoadResult | None
    note: Note | None
    time_event_blocks: list[TimeEventInDayBlock]


@readonly_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanActivityLoadUseCase(
    JupiterLoadCrownEntityUseCase[TimePlanActivityLoadArgs, TimePlanActivityLoadResult]
):
    """Use case for loading a time plan activity activity."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TimePlanActivityLoadArgs,
    ) -> TimePlanActivityLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        workspace = context.workspace

        time_plan_activity = await self.load_entity(
            uow,
            context.user.ref_id,
            TimePlanActivity,
            args.ref_id,
            allow_archived=allow_archived,
        )

        target_inbox_task = None
        target_inbox_task_info = None
        target_project = None
        target_project_info = None
        target_todo_task = None
        target_todo_task_info = None
        target_habit = None
        target_habit_info = None
        target_chore = None
        target_chore_info = None
        # Activity targets are loadable whenever the activity is — access to the
        # time plan / activity does not require separate ACL on the target.
        if time_plan_activity.is_target_inbox_task:
            target_inbox_task = await uow.get_for(InboxTask).load_by_id(
                time_plan_activity.target.ref_id,
                allow_archived=allow_archived,
            )
            target_inbox_task_info = await InboxTaskLoadService().do_it(
                uow,
                target_inbox_task,
                user_ref_id=context.user.ref_id,
                allow_archived=allow_archived,
            )
        elif time_plan_activity.is_target_project:
            if workspace.is_feature_available(WorkspaceFeature.PROJECTS):
                target_project = await uow.get_for(Project).load_by_id(
                    time_plan_activity.target.ref_id,
                    allow_archived=allow_archived,
                )
                target_project_info = await ProjectLoadService().do_it(
                    uow,
                    workspace.ref_id,
                    target_project,
                    user_ref_id=context.user.ref_id,
                    allow_archived=allow_archived,
                )
        elif time_plan_activity.is_target_todo_task:
            if workspace.is_feature_available(WorkspaceFeature.TODO_TASK):
                target_todo_task = await uow.get_for(TodoTask).load_by_id(
                    time_plan_activity.target.ref_id,
                    allow_archived=allow_archived,
                )
                target_todo_task_info = await TodoTaskLoadService().do_it(
                    uow,
                    workspace.ref_id,
                    target_todo_task,
                    user_ref_id=context.user.ref_id,
                    allow_archived=allow_archived,
                )
        elif time_plan_activity.is_target_habit:
            if workspace.is_feature_available(WorkspaceFeature.HABITS):
                target_habit = await uow.get_for(Habit).load_by_id(
                    time_plan_activity.target.ref_id,
                    allow_archived=allow_archived,
                )
                target_habit_info = await HabitLoadService(self._time_provider).do_it(
                    uow,
                    workspace.ref_id,
                    target_habit,
                    user_ref_id=context.user.ref_id,
                    allow_archived=allow_archived,
                )
        elif time_plan_activity.is_target_chore:
            if workspace.is_feature_available(WorkspaceFeature.CHORES):
                target_chore = await uow.get_for(Chore).load_by_id(
                    time_plan_activity.target.ref_id,
                    allow_archived=allow_archived,
                )
                target_chore_info = await ChoreLoadService().do_it(
                    uow,
                    workspace.ref_id,
                    target_chore,
                    user_ref_id=context.user.ref_id,
                    allow_archived=allow_archived,
                )

        note = await uow.get(NoteRepository).load_optional_for_owner(
            EntityLink.std(
                NamedEntityTag.TIME_PLAN_ACTIVITY.value,
                time_plan_activity.ref_id,
            ),
            allow_archived=allow_archived,
        )

        time_event_blocks = await uow.get_for(TimeEventInDayBlock).find_all_generic(
            allow_archived=False,
            owner=EntityLink.std(
                NamedEntityTag.TIME_PLAN_ACTIVITY.value, time_plan_activity.ref_id
            ),
        )

        return TimePlanActivityLoadResult(
            time_plan_activity=time_plan_activity,
            target_inbox_task=target_inbox_task,
            target_inbox_task_info=target_inbox_task_info,
            target_project=target_project,
            target_project_info=target_project_info,
            target_todo_task=target_todo_task,
            target_todo_task_info=target_todo_task_info,
            target_habit=target_habit,
            target_habit_info=target_habit_info,
            target_chore=target_chore,
            target_chore_info=target_chore_info,
            note=note,
            time_event_blocks=time_event_blocks,
        )
