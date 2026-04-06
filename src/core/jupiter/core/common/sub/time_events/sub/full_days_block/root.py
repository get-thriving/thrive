"""A full day block of time."""

import abc
from typing import TYPE_CHECKING

from jupiter.core.common.sub.time_events.namespace import (
    TimeEventNamespace,
)
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

if TYPE_CHECKING:
    from jupiter.core.common.sub.time_events.domain import TimeEventDomain


@entity
class TimeEventFullDaysBlock(LeafSupportEntity):
    """A full day block of time."""

    time_event_domain: ParentLink["TimeEventDomain"]

    namespace: TimeEventNamespace
    source_entity_ref_id: EntityId
    start_date: ADate
    duration_days: int
    end_date: ADate

    @staticmethod
    @create_entity_action
    def new_time_event_for_schedule_event(
        ctx: DomainContext,
        time_event_domain_ref_id: EntityId,
        schedule_event_ref_id: EntityId,
        start_date: ADate,
        duration_days: int,
    ) -> "TimeEventFullDaysBlock":
        """Create a new time event."""
        if duration_days < 1:
            raise InputValidationError("Duration must be at least 1 day.")
        return TimeEventFullDaysBlock._create(
            ctx,
            name=NOT_USED_NAME,
            time_event_domain=ParentLink(time_event_domain_ref_id),
            namespace=TimeEventNamespace.SCHEDULE_FULL_DAYS_BLOCK,
            source_entity_ref_id=schedule_event_ref_id,
            start_date=start_date,
            duration_days=duration_days,
            end_date=start_date.add_days(duration_days),
        )

    @staticmethod
    @create_entity_action
    def new_time_event_for_person_occasion(
        ctx: DomainContext,
        time_event_domain_ref_id: EntityId,
        occasion_ref_id: EntityId,
        occasion_date: ADate,
    ) -> "TimeEventFullDaysBlock":
        """Create a new time event."""
        return TimeEventFullDaysBlock._create(
            ctx,
            name=NOT_USED_NAME,
            time_event_domain=ParentLink(time_event_domain_ref_id),
            namespace=TimeEventNamespace.PERSON_OCCASION,
            source_entity_ref_id=occasion_ref_id,
            start_date=occasion_date,
            duration_days=1,
            end_date=occasion_date.add_days(1),
        )

    @staticmethod
    @create_entity_action
    def new_time_event_for_vacation(
        ctx: DomainContext,
        time_event_domain_ref_id: EntityId,
        vacation_ref_id: EntityId,
        start_date: ADate,
        end_date: ADate,
    ) -> "TimeEventFullDaysBlock":
        """Create a new time event."""
        duration_days = end_date.days_since(start_date) + 1
        if duration_days < 1:
            raise InputValidationError("Duration must be at least 1 day.")
        return TimeEventFullDaysBlock._create(
            ctx,
            name=NOT_USED_NAME,
            time_event_domain=ParentLink(time_event_domain_ref_id),
            namespace=TimeEventNamespace.VACATION,
            source_entity_ref_id=vacation_ref_id,
            start_date=start_date,
            duration_days=duration_days,
            end_date=end_date,
        )

    @update_entity_action
    def update_for_schedule_event(
        self,
        ctx: DomainContext,
        start_date: UpdateAction[ADate],
        duration_days: UpdateAction[int],
    ) -> "TimeEventFullDaysBlock":
        """Update the time event."""
        if duration_days.test(lambda t: t < 1):
            raise InputValidationError("Duration must be at least 1 day.")
        return self._new_version(
            ctx,
            start_date=start_date.or_else(self.start_date),
            duration_days=duration_days.or_else(self.duration_days),
            end_date=start_date.or_else(self.start_date).add_days(
                duration_days.or_else(self.duration_days)
            ),
        )

    @update_entity_action
    def update_for_person_occasion(
        self,
        ctx: DomainContext,
        occasion_date: ADate,
    ) -> "TimeEventFullDaysBlock":
        """Update the time event."""
        return self._new_version(
            ctx,
            start_date=occasion_date,
            duration_days=1,
            end_date=occasion_date.add_days(1),
        )

    @update_entity_action
    def update_for_vacation(
        self,
        ctx: DomainContext,
        start_date: ADate,
        end_date: ADate,
    ) -> "TimeEventFullDaysBlock":
        """Update the time event."""
        duration_days = end_date.days_since(start_date) + 1
        if duration_days < 1:
            raise InputValidationError("Duration must be at least 1 day.")
        return self._new_version(
            ctx,
            start_date=start_date,
            duration_days=duration_days,
            end_date=end_date,
        )


@value
class TimeEventFullDaysBlockStatsPerGroup(CompositeValue):
    """Just a slice of the stats."""

    date: ADate
    namespace: TimeEventNamespace
    cnt: int


@value
class TimeEventFullDaysBlockStats(CompositeValue):
    """Stats for the time event full days block in a given time period."""

    per_groups: list[TimeEventFullDaysBlockStatsPerGroup]


class TimeEventFullDaysBlockRepository(
    LeafEntityRepository[TimeEventFullDaysBlock], abc.ABC
):
    """A repository for time event full days blocks."""

    @abc.abstractmethod
    async def load_for_namespace(
        self,
        namespace: TimeEventNamespace,
        source_entity_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> TimeEventFullDaysBlock:
        """Load a time event full days block for a namespace and source entity."""

    @abc.abstractmethod
    async def find_for_namespace(
        self,
        namespace: TimeEventNamespace,
        source_entity_ref_id: EntityId | list[EntityId],
        allow_archived: bool = False,
    ) -> list[TimeEventFullDaysBlock]:
        """Find all time event full days block for a namespace and source entity."""

    @abc.abstractmethod
    async def find_all_between(
        self,
        parent_ref_id: EntityId,
        start_date: ADate,
        end_date: ADate,
    ) -> list[TimeEventFullDaysBlock]:
        """Find all time events in a range."""

    @abc.abstractmethod
    async def stats_for_all_between(
        self,
        parent_ref_id: EntityId,
        start_date: ADate,
        end_date: ADate,
    ) -> TimeEventFullDaysBlockStats:
        """Get stats for all time events in a range."""
