"""Load an in day block with associated data."""

from jupiter.core.apps.chores.root import Chore
from jupiter.core.apps.habits.root import Habit
from jupiter.core.apps.projects.root import Project
from jupiter.core.apps.schedule.sub.event_in_day.root import (
    ScheduleEventInDay,
)
from jupiter.core.apps.time_plans.sub.activity.root import TimePlanActivity
from jupiter.core.apps.todo.root import TodoTask
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    ALLOWED_TIME_EVENT_IN_DAY_OWNER_TYPES,
    TimeEventInDayBlock,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterLoadLeafSupportEntityArgs,
    JupiterLoadLeafSupportEntityUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
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
class TimeEventInDayBlockLoadArgs(JupiterLoadLeafSupportEntityArgs):
    """InDayBlockLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class TimeEventInDayBlockLoadResult(UseCaseResultBase):
    """InDayBlockLoadResult."""

    in_day_block: TimeEventInDayBlock
    schedule_event: ScheduleEventInDay | None
    project: Project | None
    todo_task: TodoTask | None
    habit: Habit | None
    chore: Chore | None
    time_plan_activity: TimePlanActivity | None


@readonly_use_case()
class TimeEventInDayBlockLoadUseCase(
    JupiterLoadLeafSupportEntityUseCase[
        TimeEventInDayBlockLoadArgs, TimeEventInDayBlockLoadResult
    ]
):
    """Load a in day block and associated data."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TimeEventInDayBlockLoadArgs,
    ) -> TimeEventInDayBlockLoadResult:
        """Load a in day block and associated data."""
        allow_archived = args.allow_archived or False
        _, in_day_block = await self.load_for_owner(
            uow,
            TimeEventDomain,
            TimeEventInDayBlock,
            args.ref_id,
            context.user.ref_id,
            context.workspace.ref_id,
            ALLOWED_TIME_EVENT_IN_DAY_OWNER_TYPES,
            AccessLevel.READER,
            allow_archived=allow_archived,
        )

        schedule_event = None
        if in_day_block.owner.the_type == NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value:
            schedule_event = await uow.get_for(ScheduleEventInDay).load_by_id(
                in_day_block.owner.ref_id,
                allow_archived=allow_archived,
            )

        project = None
        if in_day_block.owner.the_type == NamedEntityTag.PROJECT.value:
            project = await uow.get_for(Project).load_by_id(
                in_day_block.owner.ref_id,
                allow_archived=allow_archived,
            )

        todo_task = None
        if in_day_block.owner.the_type == NamedEntityTag.TODO_TASK.value:
            todo_task = await uow.get_for(TodoTask).load_by_id(
                in_day_block.owner.ref_id,
                allow_archived=allow_archived,
            )

        habit = None
        if in_day_block.owner.the_type == NamedEntityTag.HABIT.value:
            habit = await uow.get_for(Habit).load_by_id(
                in_day_block.owner.ref_id,
                allow_archived=allow_archived,
            )

        chore = None
        if in_day_block.owner.the_type == NamedEntityTag.CHORE.value:
            chore = await uow.get_for(Chore).load_by_id(
                in_day_block.owner.ref_id,
                allow_archived=allow_archived,
            )

        time_plan_activity = None
        if in_day_block.owner.the_type == NamedEntityTag.TIME_PLAN_ACTIVITY.value:
            time_plan_activity = await uow.get_for(TimePlanActivity).load_by_id(
                in_day_block.owner.ref_id,
                allow_archived=allow_archived,
            )

        return TimeEventInDayBlockLoadResult(
            in_day_block=in_day_block,
            schedule_event=schedule_event,
            project=project,
            todo_task=todo_task,
            habit=habit,
            chore=chore,
            time_plan_activity=time_plan_activity,
        )
