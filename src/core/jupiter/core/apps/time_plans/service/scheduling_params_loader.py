"""Find the scheduling params that apply to a time plan activity."""

from collections.abc import Iterable

from jupiter.core.apps.big_plans.root import BigPlan
from jupiter.core.apps.chores.root import Chore
from jupiter.core.apps.habits.sub.habit.root import Habit
from jupiter.core.apps.time_plans.sub.activity.root import TimePlanActivity
from jupiter.core.apps.todo.root import TodoTask
from jupiter.core.common.scheduling_params import SchedulingParams
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork

# The owner types whose scheduling params a time plan activity can take after.
_OWNER_KEY = tuple[str, EntityId]


class SchedulingParamsLoader:
    """Find the scheduling params that apply to a time plan activity.

    An inbox task takes after whatever generated it, so the params of an
    activity are always those of some habit, chore, todo task or big plan.
    Anything else - a metric collection task, a person catch up - has no
    entity to consult here, and is treated as schedulable.
    """

    @staticmethod
    async def load_for_owners(
        uow: DomainUnitOfWork,
        owners: Iterable[EntityLink],
    ) -> dict[_OWNER_KEY, SchedulingParams]:
        """Load the scheduling params for a batch of owner links."""
        todo_task_ref_ids: set[EntityId] = set()
        habit_ref_ids: set[EntityId] = set()
        chore_ref_ids: set[EntityId] = set()
        big_plan_ref_ids: set[EntityId] = set()

        for owner in owners:
            if owner.purpose != "std":
                continue
            if owner.the_type == NamedEntityTag.TODO_TASK.value:
                todo_task_ref_ids.add(owner.ref_id)
            elif owner.the_type == NamedEntityTag.HABIT.value:
                habit_ref_ids.add(owner.ref_id)
            elif owner.the_type == NamedEntityTag.CHORE.value:
                chore_ref_ids.add(owner.ref_id)
            elif owner.the_type == NamedEntityTag.BIG_PLAN.value:
                big_plan_ref_ids.add(owner.ref_id)

        result: dict[_OWNER_KEY, SchedulingParams] = {}

        # Parents may live in another workspace when shared; do not scope by
        # the caller's collection.
        if len(todo_task_ref_ids) > 0:
            todo_tasks = await uow.get_for(TodoTask).find_all_generic(
                parent_ref_id=None,
                allow_archived=True,
                ref_id=list(todo_task_ref_ids),
            )
            for todo_task in todo_tasks:
                result[(NamedEntityTag.TODO_TASK.value, todo_task.ref_id)] = (
                    todo_task.scheduling_params
                )

        if len(habit_ref_ids) > 0:
            habits = await uow.get_for(Habit).find_all_generic(
                parent_ref_id=None,
                allow_archived=True,
                ref_id=list(habit_ref_ids),
            )
            for habit in habits:
                result[(NamedEntityTag.HABIT.value, habit.ref_id)] = (
                    habit.scheduling_params
                )

        if len(chore_ref_ids) > 0:
            chores = await uow.get_for(Chore).find_all_generic(
                parent_ref_id=None,
                allow_archived=True,
                ref_id=list(chore_ref_ids),
            )
            for chore in chores:
                result[(NamedEntityTag.CHORE.value, chore.ref_id)] = (
                    chore.scheduling_params
                )

        if len(big_plan_ref_ids) > 0:
            big_plans = await uow.get_for(BigPlan).find_all_generic(
                parent_ref_id=None,
                allow_archived=True,
                ref_id=list(big_plan_ref_ids),
            )
            for big_plan in big_plans:
                result[(NamedEntityTag.BIG_PLAN.value, big_plan.ref_id)] = (
                    big_plan.scheduling_params
                )

        return result

    @staticmethod
    async def load_for_activity(
        uow: DomainUnitOfWork,
        activity: TimePlanActivity,
    ) -> SchedulingParams:
        """Load the scheduling params for a single activity."""
        if activity.is_target_habit_stack or activity.is_target_chore_stack:
            return await SchedulingParamsLoader._load_for_stack(uow, activity)

        owner = activity.target
        if activity.is_target_inbox_task:
            inbox_task = await uow.get_for(InboxTask).load_by_id(
                activity.target.ref_id, allow_archived=True
            )
            owner = inbox_task.owner

        by_owner = await SchedulingParamsLoader.load_for_owners(uow, [owner])
        return by_owner.get((owner.the_type, owner.ref_id), SchedulingParams.default())

    @staticmethod
    async def _load_for_stack(
        uow: DomainUnitOfWork,
        activity: TimePlanActivity,
    ) -> SchedulingParams:
        """A stack can be scheduled as long as one of its members can be."""
        members: list[SchedulingParams]
        if activity.is_target_habit_stack:
            habits = await uow.get_for(Habit).find_all_generic(
                parent_ref_id=None,
                allow_archived=False,
                stack_ref_id=activity.target.ref_id,
            )
            members = [habit.scheduling_params for habit in habits]
        else:
            chores = await uow.get_for(Chore).find_all_generic(
                parent_ref_id=None,
                allow_archived=False,
                stack_ref_id=activity.target.ref_id,
            )
            members = [chore.scheduling_params for chore in chores]

        if len(members) == 0:
            return SchedulingParams.default()
        if any(member.is_schedulable for member in members):
            return SchedulingParams.default()
        return SchedulingParams.not_schedulable()
