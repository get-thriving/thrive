"""A full day block of time."""

import abc
from typing import Final

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

ALLOWED_TIME_EVENT_FULL_DAYS_OWNER_TYPES: Final[frozenset[str]] = frozenset(
    {
        NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
        NamedEntityTag.OCCASION.value,
        NamedEntityTag.VACATION.value,
    }
)


@entity("TimeEventDomain")
class TimeEventFullDaysBlock(LeafSupportEntity):
    """A full day block of time."""

    time_event_domain: ParentLink

    owner: EntityLink
    start_date: ADate
    duration_days: int
    end_date: ADate

    @staticmethod
    def _new_with_owner(
        ctx: DomainContext,
        time_event_domain_ref_id: EntityId,
        owner: EntityLink,
        start_date: ADate,
        duration_days: int,
        end_date: ADate,
    ) -> "TimeEventFullDaysBlock":
        if duration_days < 1:
            raise InputValidationError("Duration must be at least 1 day.")
        if owner.the_type not in ALLOWED_TIME_EVENT_FULL_DAYS_OWNER_TYPES:
            raise InputValidationError(
                f"Invalid time event full days block owner entity type: {owner.the_type!r}",
            )
        if owner.purpose != "std":
            raise InputValidationError(
                f"Time event full days block owner purpose must be 'std', got {owner.purpose!r}",
            )
        return TimeEventFullDaysBlock._create(
            ctx,
            name=NOT_USED_NAME,
            time_event_domain=ParentLink(time_event_domain_ref_id),
            owner=owner,
            start_date=start_date,
            duration_days=duration_days,
            end_date=end_date,
        )

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
        return TimeEventFullDaysBlock._new_with_owner(
            ctx,
            time_event_domain_ref_id,
            EntityLink.std(
                NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
                schedule_event_ref_id,
            ),
            start_date,
            duration_days,
            start_date.add_days(duration_days),
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
        return TimeEventFullDaysBlock._new_with_owner(
            ctx,
            time_event_domain_ref_id,
            EntityLink.std(NamedEntityTag.OCCASION.value, occasion_ref_id),
            occasion_date,
            1,
            occasion_date.add_days(1),
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
        return TimeEventFullDaysBlock._new_with_owner(
            ctx,
            time_event_domain_ref_id,
            EntityLink.std(NamedEntityTag.VACATION.value, vacation_ref_id),
            start_date,
            duration_days,
            end_date,
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
    entity_tag: str
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
    async def load_for_owner(
        self,
        owner: EntityLink,
        allow_archived: bool = False,
    ) -> TimeEventFullDaysBlock:
        """Load when exactly one block exists for this owner (schedule event, vacation)."""

    @abc.abstractmethod
    async def find_for_owner(
        self,
        owner: EntityLink | list[EntityLink],
        allow_archived: bool = False,
    ) -> list[TimeEventFullDaysBlock]:
        """Find all blocks for the given owner link(s)."""

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
