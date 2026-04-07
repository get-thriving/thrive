"""The record of a streak of a habit."""

import abc

from jupiter.core.common.sub.inbox_tasks.status import InboxTaskStatus
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import ParentLink
from jupiter.framework.record import (
    Record,
    create_record_action,
    record,
    update_record_action,
)
from jupiter.framework.storage.repository import RecordRepository


@record("Habit")
class HabitStreakMark(Record):
    """The record of a streak of a habit."""

    habit: ParentLink
    date: ADate
    statuses: dict[EntityId, InboxTaskStatus]

    @staticmethod
    @create_record_action
    def new_mark(
        ctx: DomainContext,
        habit_ref_id: EntityId,
        date: ADate,
        statuses: dict[EntityId, InboxTaskStatus],
    ) -> "HabitStreakMark":
        """Create a new streak mark."""
        return HabitStreakMark._create(
            ctx,
            habit=ParentLink(habit_ref_id),
            date=date,
            statuses=statuses,
        )

    @update_record_action
    def update_status(
        self, ctx: DomainContext, inbox_task_ref_id: EntityId, status: InboxTaskStatus
    ) -> "HabitStreakMark":
        """Update the status of the streak mark."""
        return HabitStreakMark._new_version(
            self, ctx, statuses={**self.statuses, inbox_task_ref_id: status}
        )

    @update_record_action
    def remove_status(
        self, ctx: DomainContext, inbox_task_ref_id: EntityId
    ) -> "HabitStreakMark":
        """Remove the status of the streak mark."""
        return HabitStreakMark._new_version(
            self,
            ctx,
            statuses={k: v for k, v in self.statuses.items() if k != inbox_task_ref_id},
        )

    @property
    def raw_key(self) -> object:
        """The raw key of the streak mark."""
        return (self.habit.ref_id, self.date)


class HabitStreakMarkRepository(
    RecordRepository[HabitStreakMark, tuple[EntityId, ADate]], abc.ABC
):
    """A repository of habit streak marks."""

    @abc.abstractmethod
    async def upsert(self, habit_streak_mark: HabitStreakMark) -> None:
        """Upsert a habit streak mark."""

    @abc.abstractmethod
    async def find_all_between_dates(
        self, habit_ref_id: EntityId, start_date: ADate, end_date: ADate
    ) -> list[HabitStreakMark]:
        """Find all streak marks between two dates."""
