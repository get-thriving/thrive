"""A specific schedule group or stream of events."""

from jupiter.core.domainx.core.notes.note import Note
from jupiter.core.domainx.core.notes.note_domain import NoteDomain
from jupiter.core.domainx.core.url import URL
from jupiter.core.schedule.sub.event_full_days.root import (
    ScheduleEventFullDays,
)
from jupiter.core.schedule.sub.event_in_day.root import (
    ScheduleEventInDay,
)
from jupiter.core.schedule.sub.stream.color import (
    ScheduleStreamColor,
)
from jupiter.core.schedule.sub.stream.name import ScheduleStreamName
from jupiter.core.schedule.sub.stream.source import (
    ScheduleStreamSource,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    IsRefId,
    LeafEntity,
    OwnsAtMostOne,
    OwnsMany,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.update_action import UpdateAction


class CannotModifyScheduleStreamError(Exception):
    """Cannot modify the schedule stream."""


@entity
class ScheduleStream(LeafEntity):
    """A schedule group or stream of events."""

    schedule_domain: ParentLink

    source: ScheduleStreamSource
    name: ScheduleStreamName
    color: ScheduleStreamColor
    source_ical_url: URL | None

    in_day_events = OwnsMany(ScheduleEventInDay, schedule_stream_ref_id=IsRefId())
    full_days_events = OwnsMany(ScheduleEventFullDays, schedule_stream_ref_id=IsRefId())
    note = OwnsAtMostOne(
        Note, domain=NoteDomain.SCHEDULE_STREAM, source_entity_ref_id=IsRefId()
    )

    @staticmethod
    @create_entity_action
    def new_schedule_stream_for_user(
        ctx: MutationContext,
        schedule_domain_ref_id: EntityId,
        name: ScheduleStreamName,
        color: ScheduleStreamColor,
    ) -> "ScheduleStream":
        """Create a new schedule."""
        return ScheduleStream._create(
            ctx,
            schedule_domain=ParentLink(schedule_domain_ref_id),
            source=ScheduleStreamSource.USER,
            name=name,
            color=color,
            source_ical_url=None,
        )

    @staticmethod
    @create_entity_action
    def new_schedule_stream_from_external_ical(
        ctx: MutationContext,
        schedule_domain_ref_id: EntityId,
        name: ScheduleStreamName,
        color: ScheduleStreamColor,
        source_ical_url: URL,
    ) -> "ScheduleStream":
        """Create a new schedule from an external ical."""
        return ScheduleStream._create(
            ctx,
            schedule_domain=ParentLink(schedule_domain_ref_id),
            source=ScheduleStreamSource.EXTERNAL_ICAL,
            name=name,
            color=color,
            source_ical_url=source_ical_url,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        name: UpdateAction[ScheduleStreamName],
        color: UpdateAction[ScheduleStreamColor],
    ) -> "ScheduleStream":
        """Update the schedule."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            color=color.or_else(self.color),
        )

    @property
    def can_be_modified_independently(self) -> bool:
        """Return whether the schedule can be modified independently."""
        return self.source == ScheduleStreamSource.USER
