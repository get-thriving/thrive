"""Load an in day block with associated data."""

from jupiter.core.projects.root import Project
from jupiter.core.chores.root import Chore
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.habits.root import Habit
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.schedule.sub.event_in_day.root import (
    ScheduleEventInDay,
)
from jupiter.core.time_plans.sub.activity.root import TimePlanActivity
from jupiter.core.todo.root import TodoTask
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class TimeEventInDayBlockLoadArgs(UseCaseArgsBase):
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
    JupiterTransactionalLoggedInReadOnlyUseCase[
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
        in_day_block = await uow.get_for(TimeEventInDayBlock).load_by_id(
            args.ref_id,
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
