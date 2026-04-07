"""Time event."""

import abc

from jupiter.core.common.sub.time_events.namespace import (
    TimeEventNamespace,
)
from jupiter.core.common.time_in_day import TimeInDay
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
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


@entity("TimeEventDomain")
class TimeEventInDayBlock(LeafSupportEntity):
    """Time event."""

    time_event_domain: ParentLink

    namespace: TimeEventNamespace
    source_entity_ref_id: EntityId
    start_date: ADate
    start_time_in_day: TimeInDay
    duration_mins: int

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
        if duration_mins < MIN_DURATION_MINS:
            raise InputValidationError(
                f"Duration must be at least {MIN_DURATION_MINS} minute."
            )
        if duration_mins > MAX_DURATION_MINS:
            raise InputValidationError(
                f"Duration must be at most {MAX_DURATION_MINS // 60} hours."
            )
        return TimeEventInDayBlock._create(
            ctx,
            time_event_domain=ParentLink(time_event_domain_ref_id),
            namespace=TimeEventNamespace.SCHEDULE_EVENT_IN_DAY,
            source_entity_ref_id=schedule_event_ref_id,
            name=NOT_USED_NAME,
            start_date=start_date,
            start_time_in_day=start_time_in_day,
            duration_mins=duration_mins,
        )

    @staticmethod
    @create_entity_action
    def new_time_event_for_big_plan(
        ctx: DomainContext,
        time_event_domain_ref_id: EntityId,
        big_plan_ref_id: EntityId,
        start_date: ADate,
        start_time_in_day: TimeInDay,
        duration_mins: int,
    ) -> "TimeEventInDayBlock":
        """Create a new time event for a big plan."""
        if duration_mins < MIN_DURATION_MINS:
            raise InputValidationError(
                f"Duration must be at least {MIN_DURATION_MINS} minute."
            )
        if duration_mins > MAX_DURATION_MINS:
            raise InputValidationError(
                f"Duration must be at most {MAX_DURATION_MINS // 60} hours."
            )
        return TimeEventInDayBlock._create(
            ctx,
            time_event_domain=ParentLink(time_event_domain_ref_id),
            namespace=TimeEventNamespace.BIG_PLAN,
            source_entity_ref_id=big_plan_ref_id,
            name=NOT_USED_NAME,
            start_date=start_date,
            start_time_in_day=start_time_in_day,
            duration_mins=duration_mins,
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
        if duration_mins < MIN_DURATION_MINS:
            raise InputValidationError(
                f"Duration must be at least {MIN_DURATION_MINS} minute."
            )
        if duration_mins > MAX_DURATION_MINS:
            raise InputValidationError(
                f"Duration must be at most {MAX_DURATION_MINS // 60} hours."
            )
        return TimeEventInDayBlock._create(
            ctx,
            time_event_domain=ParentLink(time_event_domain_ref_id),
            namespace=TimeEventNamespace.TODO_TASK,
            source_entity_ref_id=todo_task_ref_id,
            name=NOT_USED_NAME,
            start_date=start_date,
            start_time_in_day=start_time_in_day,
            duration_mins=duration_mins,
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
        if duration_mins < MIN_DURATION_MINS:
            raise InputValidationError(
                f"Duration must be at least {MIN_DURATION_MINS} minute."
            )
        if duration_mins > MAX_DURATION_MINS:
            raise InputValidationError(
                f"Duration must be at most {MAX_DURATION_MINS // 60} hours."
            )
        return TimeEventInDayBlock._create(
            ctx,
            time_event_domain=ParentLink(time_event_domain_ref_id),
            namespace=TimeEventNamespace.HABIT,
            source_entity_ref_id=habit_ref_id,
            name=NOT_USED_NAME,
            start_date=start_date,
            start_time_in_day=start_time_in_day,
            duration_mins=duration_mins,
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
        if duration_mins < MIN_DURATION_MINS:
            raise InputValidationError(
                f"Duration must be at least {MIN_DURATION_MINS} minute."
            )
        if duration_mins > MAX_DURATION_MINS:
            raise InputValidationError(
                f"Duration must be at most {MAX_DURATION_MINS // 60} hours."
            )
        return TimeEventInDayBlock._create(
            ctx,
            time_event_domain=ParentLink(time_event_domain_ref_id),
            namespace=TimeEventNamespace.CHORE,
            source_entity_ref_id=chore_ref_id,
            name=NOT_USED_NAME,
            start_date=start_date,
            start_time_in_day=start_time_in_day,
            duration_mins=duration_mins,
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
        if duration_mins < MIN_DURATION_MINS:
            raise InputValidationError(
                f"Duration must be at least {MIN_DURATION_MINS} minute."
            )
        if duration_mins > MAX_DURATION_MINS:
            raise InputValidationError(
                f"Duration must be at most {MAX_DURATION_MINS // 60} hours."
            )
        return TimeEventInDayBlock._create(
            ctx,
            time_event_domain=ParentLink(time_event_domain_ref_id),
            namespace=TimeEventNamespace.TIME_PLAN_ACTIVITY,
            source_entity_ref_id=time_plan_activity_ref_id,
            name=NOT_USED_NAME,
            start_date=start_date,
            start_time_in_day=start_time_in_day,
            duration_mins=duration_mins,
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
        if self.namespace == TimeEventNamespace.BIG_PLAN:
            return True
        if self.namespace == TimeEventNamespace.TODO_TASK:
            return True
        if self.namespace == TimeEventNamespace.HABIT:
            return True
        if self.namespace == TimeEventNamespace.CHORE:
            return True
        if self.namespace == TimeEventNamespace.TIME_PLAN_ACTIVITY:
            return True
        if self.namespace == TimeEventNamespace.PERSON_OCCASION:
            return True
        return False


@value
class TimeEventInDayBlockStatsPerGroup(CompositeValue):
    """Just a slice of the stats."""

    date: ADate
    namespace: TimeEventNamespace
    cnt: int


@value
class TimeEventInDayBlockStats(CompositeValue):
    """Stats for time events."""

    per_groups: list[TimeEventInDayBlockStatsPerGroup]


class TimeEventInDayBlockRepository(LeafEntityRepository[TimeEventInDayBlock], abc.ABC):
    """Time event repository."""

    @abc.abstractmethod
    async def load_for_namespace(
        self,
        namespace: TimeEventNamespace,
        source_entity_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> TimeEventInDayBlock:
        """Load a time event for a namespace."""

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
