"""A specific schedule group or stream of events."""

from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.common.url import URL
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
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsEntityLinkStd,
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


@entity("ScheduleDomain")
class ScheduleStream(LeafEntity):
    """A schedule group or stream of events."""

    schedule_domain: ParentLink

    source: ScheduleStreamSource
    name: ScheduleStreamName
    color: ScheduleStreamColor
    source_ical_url: URL | None

    in_day_events = OwnsMany(ScheduleEventInDay, schedule_stream_ref_id=IsRefId())
    full_days_events = OwnsMany(ScheduleEventFullDays, schedule_stream_ref_id=IsRefId())
    tag_link = OwnsAtMostOne(
        TagLink, namespace=TagNamespace.SCHEDULE_STREAM, source_entity_ref_id=IsRefId()
    )
    note = OwnsAtMostOne(
        Note, owner=IsEntityLinkStd(NamedEntityTag.SCHEDULE_STREAM.value)
    )

    @staticmethod
    @create_entity_action
    def new_schedule_stream_for_user(
        ctx: DomainContext,
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
        ctx: DomainContext,
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
        ctx: DomainContext,
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
