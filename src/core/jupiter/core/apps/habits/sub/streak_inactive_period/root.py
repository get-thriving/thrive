"""A stretch of a habit streak that should not count."""

import abc

from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    LeafEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import LeafEntityRepository


def validate_inactive_period_range(
    ctx: DomainContext,
    start_date: ADate,
    end_date: ADate,
) -> None:
    """Reject a range that runs backwards or past today."""
    if start_date > end_date:
        raise InputValidationError(
            f"Start date {start_date} must be on or before end date {end_date}",
        )
    today = ADate.from_timestamp(ctx.action_timestamp)
    if end_date > today:
        raise InputValidationError(
            f"End date {end_date} cannot be after today ({today})",
        )


def reset_streak_bounds(
    today: ADate,
    earliest_mark_date: ADate | None,
    habit_created_date: ADate,
) -> tuple[ADate, ADate]:
    """Range covering the streak so far, through yesterday.

    Today stays open. When the habit has no streak marks, the range starts on
    the day the habit was created.
    """
    end_date = today.subtract_days(1)
    start_date = (
        earliest_mark_date if earliest_mark_date is not None else habit_created_date
    )
    if start_date > end_date:
        raise InputValidationError(
            "There is no streak history before today to mark inactive",
        )
    return start_date, end_date


@entity("Habit")
class HabitStreakInactivePeriod(LeafEntity):
    """A date range whose streak days should render as inactive."""

    habit: ParentLink
    name: EntityName
    start_date: ADate
    end_date: ADate

    @staticmethod
    @create_entity_action
    def new_habit_streak_inactive_period(
        ctx: DomainContext,
        habit_ref_id: EntityId,
        name: EntityName,
        start_date: ADate,
        end_date: ADate,
    ) -> "HabitStreakInactivePeriod":
        """Create an inactive period."""
        validate_inactive_period_range(ctx, start_date, end_date)
        return HabitStreakInactivePeriod._create(
            ctx,
            habit=ParentLink(habit_ref_id),
            name=name,
            start_date=start_date,
            end_date=end_date,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: EntityName,
        start_date: ADate,
        end_date: ADate,
    ) -> "HabitStreakInactivePeriod":
        """Change the name or the range."""
        validate_inactive_period_range(ctx, start_date, end_date)
        return self._new_version(
            ctx,
            name=name,
            start_date=start_date,
            end_date=end_date,
        )


class HabitStreakInactivePeriodRepository(
    LeafEntityRepository[HabitStreakInactivePeriod], abc.ABC
):
    """The repository for habit streak inactive periods."""

    @abc.abstractmethod
    async def find_all_for_habit_overlapping(
        self,
        habit_ref_id: EntityId,
        start_date: ADate,
        end_date: ADate,
        allow_archived: bool = False,
    ) -> list[HabitStreakInactivePeriod]:
        """Find periods that overlap the inclusive date range."""
