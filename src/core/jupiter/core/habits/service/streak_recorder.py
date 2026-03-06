"""A service for recording streak marks."""

from typing import Iterable, cast

from jupiter.core.common import schedules
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.tasks.root import Task
from jupiter.core.habits.root import Habit
from jupiter.core.habits.streak_mark import (
    HabitStreakMark,
    HabitStreakMarkRepository,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.context import MutationContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class HabitStreakRecorderService:
    """A service for recording streak marks."""

    async def upsert(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        today: ADate,
        habit: Habit,
        tasks: Iterable[Task],
    ) -> None:
        """Record a streak mark."""
        schedule = schedules.get_schedule(
            period=habit.gen_params.period,
            name=habit.name,
            right_now=today.to_timestamp_at_start_of_day(),
        )

        statuses = {task.ref_id: task.status for task in tasks}

        start_date = schedule.first_day
        while start_date <= schedule.end_day:
            habit_streak_mark = HabitStreakMark.new_mark(
                ctx=ctx,
                habit_ref_id=habit.ref_id,
                date=start_date,
                statuses=statuses,
            )
            await uow.get(HabitStreakMarkRepository).upsert(habit_streak_mark)
            start_date = start_date.add_days(1)

    async def update_with_status(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        habit: Habit,
        task: Task,
    ) -> None:
        """Update a streak mark with a new status."""
        schedule = schedules.get_schedule(
            period=habit.gen_params.period,
            name=habit.name,
            right_now=cast(Timestamp, task.recurring_gen_right_now),
        )

        start_date = schedule.first_day
        while start_date <= schedule.end_day:
            habit_streak_mark = await uow.get(
                HabitStreakMarkRepository
            ).load_by_key_optional((habit.ref_id, start_date))
            if habit_streak_mark is None:
                habit_streak_mark = HabitStreakMark.new_mark(
                    ctx=ctx,
                    habit_ref_id=habit.ref_id,
                    date=start_date,
                    statuses={task.ref_id: task.status},
                )
            else:
                habit_streak_mark = habit_streak_mark.update_status(
                    ctx, task.ref_id, task.status
                )

            await uow.get(HabitStreakMarkRepository).upsert(habit_streak_mark)
            start_date = start_date.add_days(1)

    async def remove_with_status(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        habit: Habit,
        task: Task,
    ) -> None:
        """Remove a streak mark."""
        schedule = schedules.get_schedule(
            period=habit.gen_params.period,
            name=habit.name,
            right_now=cast(Timestamp, task.recurring_gen_right_now),
        )

        start_date = schedule.first_day
        while start_date <= schedule.end_day:
            habit_streak_mark = await uow.get(
                HabitStreakMarkRepository
            ).load_by_key_optional((habit.ref_id, start_date))
            if habit_streak_mark is None:
                continue
            else:
                habit_streak_mark = habit_streak_mark.remove_status(ctx, task.ref_id)

            await uow.get(HabitStreakMarkRepository).upsert(habit_streak_mark)
            start_date = start_date.add_days(1)

    async def remove_all(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        habit: Habit,
        today: ADate,
        alternative_period: RecurringTaskPeriod,
    ) -> None:
        """Remove all streak marks."""
        schedule = schedules.get_schedule(
            period=alternative_period,
            name=habit.name,
            right_now=today.to_timestamp_at_start_of_day(),
        )

        start_date = schedule.first_day
        while start_date <= schedule.end_day:
            await uow.get(HabitStreakMarkRepository).remove((habit.ref_id, start_date))
            start_date = start_date.add_days(1)
