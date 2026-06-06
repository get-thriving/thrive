"""Time event."""

import abc
from typing import Final

from jupiter.core.common.time_in_day import TimeInDay
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.base.entity_name import NOT_USED_NAME
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    LeafSupportEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.value import CompositeValue, value

# Define constants at the top level
MIN_DURATION_MINS = 1
MAX_DURATION_MINS = 2 * 24 * 60  # 48 hours

ALLOWED_TIME_EVENT_IN_DAY_OWNER_TYPES: Final[frozenset[str]] = frozenset(
    {
        NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,
        NamedEntityTag.PROJECT.value,
        NamedEntityTag.TODO_TASK.value,
        NamedEntityTag.HABIT.value,
        NamedEntityTag.CHORE.value,
        NamedEntityTag.TIME_PLAN_ACTIVITY.value,
    }
)


@entity("TimeEventDomain")
class TimeEventInDayBlock(LeafSupportEntity):
    """Time event."""

    time_event_domain: ParentLink

    owner: EntityLink
    start_date: ADate
    start_time_in_day: TimeInDay
    duration_mins: int

    @staticmethod
    def _new_with_owner(
        ctx: DomainContext,
        time_event_domain_ref_id: EntityId,
        owner: EntityLink,
        start_date: ADate,
        start_time_in_day: TimeInDay,
        duration_mins: int,
    ) -> "TimeEventInDayBlock":
        if duration_mins < MIN_DURATION_MINS:
            raise InputValidationError(
                f"Duration must be at least {MIN_DURATION_MINS} minute."
            )
        if duration_mins > MAX_DURATION_MINS:
            raise InputValidationError(
                f"Duration must be at most {MAX_DURATION_MINS // 60} hours."
            )
        if owner.the_type not in ALLOWED_TIME_EVENT_IN_DAY_OWNER_TYPES:
            raise InputValidationError(
                f"Invalid time event in day block owner entity type: {owner.the_type!r}",
            )
        if owner.purpose != "std":
            raise InputValidationError(
                f"Time event in day block owner purpose must be 'std', got {owner.purpose!r}",
            )
        return TimeEventInDayBlock._create(
            ctx,
            time_event_domain=ParentLink(time_event_domain_ref_id),
            owner=owner,
            name=NOT_USED_NAME,
            start_date=start_date,
            start_time_in_day=start_time_in_day,
            duration_mins=duration_mins,
        )

    @staticmethod
    @create_entity_action
    def new_time_event_for_schedule_event(
        ctx: DomainContext,
        time_event_domain_ref_id: EntityId,
        schedule_event_ref_id: EntityId,
        start_date: ADate,
        start_time_in_day: TimeInDay,
        duration_mins: int,
    ) -> "TimeEventInDayBlock":
        """Create a new time event."""
        return TimeEventInDayBlock._new_with_owner(
            ctx,
            time_event_domain_ref_id,
            EntityLink.std(
                NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value, schedule_event_ref_id
            ),
            start_date,
            start_time_in_day,
            duration_mins,
        )

    @staticmethod
    @create_entity_action
    def new_time_event_for_project(
        ctx: DomainContext,
        time_event_domain_ref_id: EntityId,
        project_ref_id: EntityId,
        start_date: ADate,
        start_time_in_day: TimeInDay,
        duration_mins: int,
    ) -> "TimeEventInDayBlock":
        """Create a new time event for a project."""
        return TimeEventInDayBlock._new_with_owner(
            ctx,
            time_event_domain_ref_id,
            EntityLink.std(NamedEntityTag.PROJECT.value, project_ref_id),
            start_date,
            start_time_in_day,
            duration_mins,
        )

    @staticmethod
    @create_entity_action
    def new_time_event_for_todo_task(
        ctx: DomainContext,
        time_event_domain_ref_id: EntityId,
        todo_task_ref_id: EntityId,
        start_date: ADate,
        start_time_in_day: TimeInDay,
        duration_mins: int,
    ) -> "TimeEventInDayBlock":
        """Create a new time event for a todo task."""
        return TimeEventInDayBlock._new_with_owner(
            ctx,
            time_event_domain_ref_id,
            EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task_ref_id),
            start_date,
            start_time_in_day,
            duration_mins,
        )

    @staticmethod
    @create_entity_action
    def new_time_event_for_habit(
        ctx: DomainContext,
        time_event_domain_ref_id: EntityId,
        habit_ref_id: EntityId,
        start_date: ADate,
        start_time_in_day: TimeInDay,
        duration_mins: int,
    ) -> "TimeEventInDayBlock":
        """Create a new time event for a habit."""
        return TimeEventInDayBlock._new_with_owner(
            ctx,
            time_event_domain_ref_id,
            EntityLink.std(NamedEntityTag.HABIT.value, habit_ref_id),
            start_date,
            start_time_in_day,
            duration_mins,
        )

    @staticmethod
    @create_entity_action
    def new_time_event_for_chore(
        ctx: DomainContext,
        time_event_domain_ref_id: EntityId,
        chore_ref_id: EntityId,
        start_date: ADate,
        start_time_in_day: TimeInDay,
        duration_mins: int,
    ) -> "TimeEventInDayBlock":
        """Create a new time event for a chore."""
        return TimeEventInDayBlock._new_with_owner(
            ctx,
            time_event_domain_ref_id,
            EntityLink.std(NamedEntityTag.CHORE.value, chore_ref_id),
            start_date,
            start_time_in_day,
            duration_mins,
        )

    @staticmethod
    @create_entity_action
    def new_time_event_for_time_plan_activity(
        ctx: DomainContext,
        time_event_domain_ref_id: EntityId,
        time_plan_activity_ref_id: EntityId,
        start_date: ADate,
        start_time_in_day: TimeInDay,
        duration_mins: int,
    ) -> "TimeEventInDayBlock":
        """Create a new time event for a time plan activity."""
        return TimeEventInDayBlock._new_with_owner(
            ctx,
            time_event_domain_ref_id,
            EntityLink.std(
                NamedEntityTag.TIME_PLAN_ACTIVITY.value, time_plan_activity_ref_id
            ),
            start_date,
            start_time_in_day,
            duration_mins,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        start_date: UpdateAction[ADate],
        start_time_in_day: UpdateAction[TimeInDay],
        duration_mins: UpdateAction[int],
    ) -> "TimeEventInDayBlock":
        """Update the time event."""
        if duration_mins.test(lambda t: t < MIN_DURATION_MINS):
            raise InputValidationError(
                f"Duration must be at least {MIN_DURATION_MINS} minute."
            )
        if duration_mins.test(lambda t: t > MAX_DURATION_MINS):
            raise InputValidationError(
                f"Duration must be at most {MAX_DURATION_MINS // 60} hours."
            )
        return self._new_version(
            ctx,
            start_date=start_date.or_else(self.start_date),
            start_time_in_day=start_time_in_day.or_else(self.start_time_in_day),
            duration_mins=duration_mins.or_else(self.duration_mins),
        )

    @property
    def can_be_modified_independently(self) -> bool:
        """Check if the time event can be archived independently."""
        return self.owner.the_type in (
            NamedEntityTag.PROJECT.value,
            NamedEntityTag.TODO_TASK.value,
            NamedEntityTag.HABIT.value,
            NamedEntityTag.CHORE.value,
            NamedEntityTag.TIME_PLAN_ACTIVITY.value,
        )


@value
class TimeEventInDayBlockStatsPerGroup(CompositeValue):
    """Just a slice of the stats."""

    date: ADate
    entity_tag: str
    cnt: int


@value
class TimeEventInDayBlockStats(CompositeValue):
    """Stats for time events."""

    per_groups: list[TimeEventInDayBlockStatsPerGroup]


class TimeEventInDayBlockRepository(LeafEntityRepository[TimeEventInDayBlock], abc.ABC):
    """Time event repository."""

    @abc.abstractmethod
    async def load_for_owner(
        self,
        owner: EntityLink,
        allow_archived: bool = False,
    ) -> TimeEventInDayBlock:
        """Load a time event in day block by its owner link."""

    @abc.abstractmethod
    async def find_all_between(
        self,
        parent_ref_id: EntityId,
        start_date: ADate,
        end_date: ADate,
    ) -> list[TimeEventInDayBlock]:
        """Find all time events between two dates."""

    @abc.abstractmethod
    async def stats_for_all_between(
        self,
        parent_ref_id: EntityId,
        start_date: ADate,
        end_date: ADate,
    ) -> TimeEventInDayBlockStats:
        """Get stats for all time events between two dates."""
