"""A service for recording streak marks."""

from typing import Iterable, cast

from jupiter.core.apps.habits.root import Habit
from jupiter.core.apps.habits.streak_mark import (
    HabitStreakMark,
    HabitStreakMarkRepository,
)
from jupiter.core.common import schedules
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class HabitStreakRecorderService:
    """A service for recording streak marks."""

    async def upsert(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        today: ADate,
        habit: Habit,
        inbox_tasks: Iterable[InboxTask],
    ) -> None:
        """Record a streak mark."""
        schedule = schedules.get_schedule(
            period=habit.gen_params.period,
            name=habit.name,
            right_now=today.to_timestamp_at_start_of_day(),
        )

        statuses = {inbox_task.ref_id: inbox_task.status for inbox_task in inbox_tasks}

        habit_streak_marks = []
        start_date = schedule.first_day
        while start_date <= schedule.end_day:
            habit_streak_marks.append(
                HabitStreakMark.new_mark(
                    ctx=ctx,
                    habit_ref_id=habit.ref_id,
                    date=start_date,
                    statuses=statuses,
                )
            )
            start_date = start_date.add_days(1)

        await uow.get(HabitStreakMarkRepository).upsert_all(habit_streak_marks)

    async def update_with_status(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        habit: Habit,
        inbox_task: InboxTask,
    ) -> None:
        """Update a streak mark with a new status."""
        schedule = schedules.get_schedule(
            period=habit.gen_params.period,
            name=habit.name,
            right_now=cast(Timestamp, inbox_task.recurring_gen_right_now),
        )

        existing_marks_by_date = {
            habit_streak_mark.date: habit_streak_mark
            for habit_streak_mark in await uow.get(
                HabitStreakMarkRepository
            ).find_all_between_dates(habit.ref_id, schedule.first_day, schedule.end_day)
        }

        habit_streak_marks = []
        start_date = schedule.first_day
        while start_date <= schedule.end_day:
            existing_mark = existing_marks_by_date.get(start_date)
            if existing_mark is None:
                habit_streak_marks.append(
                    HabitStreakMark.new_mark(
                        ctx=ctx,
                        habit_ref_id=habit.ref_id,
                        date=start_date,
                        statuses={inbox_task.ref_id: inbox_task.status},
                    )
                )
            else:
                habit_streak_marks.append(
                    existing_mark.update_status(
                        ctx, inbox_task.ref_id, inbox_task.status
                    )
                )
            start_date = start_date.add_days(1)

        await uow.get(HabitStreakMarkRepository).upsert_all(habit_streak_marks)

    async def remove_with_status(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        habit: Habit,
        inbox_task: InboxTask,
    ) -> None:
        """Remove a streak mark."""
        schedule = schedules.get_schedule(
            period=habit.gen_params.period,
            name=habit.name,
            right_now=cast(Timestamp, inbox_task.recurring_gen_right_now),
        )

        existing_marks = await uow.get(
            HabitStreakMarkRepository
        ).find_all_between_dates(habit.ref_id, schedule.first_day, schedule.end_day)

        habit_streak_marks = [
            existing_mark.remove_status(ctx, inbox_task.ref_id)
            for existing_mark in existing_marks
        ]

        await uow.get(HabitStreakMarkRepository).upsert_all(habit_streak_marks)

    async def remove_all(
        self,
        ctx: DomainContext,
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
