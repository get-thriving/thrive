"""An event in a schedule."""

from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.common.sub.time_events.namespace import (
    TimeEventNamespace,
)
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.schedule.sub.event_in_day.name import ScheduleEventInDayName
from jupiter.core.schedule.sub.external_sync_log.external_uid import (
    ScheduleExternalUid,
)
from jupiter.core.schedule.sub.stream.source import ScheduleStreamSource
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsRefId,
    LeafEntity,
    OwnsAtMostOne,
    OwnsOne,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.update_action import UpdateAction


@entity("ScheduleDomain")
class ScheduleEventInDay(LeafEntity):
    """An event in a schedule."""

    schedule_domain: ParentLink

    schedule_stream_ref_id: EntityId
    source: ScheduleStreamSource
    name: ScheduleEventInDayName
    external_uid: ScheduleExternalUid | None

    time_event_in_day_block = OwnsOne(
        TimeEventInDayBlock,
        namespace=TimeEventNamespace.SCHEDULE_EVENT_IN_DAY,
        source_entity_ref_id=IsRefId(),
    )
    tag_link = OwnsAtMostOne(
        TagLink,
        namespace=TagNamespace.SCHEDULE_EVENT_IN_DAY,
        source_entity_ref_id=IsRefId(),
    )
    note = OwnsAtMostOne(
        Note,
        namespace=NoteNamespace.SCHEDULE_EVENT_IN_DAY,
        source_entity_ref_id=IsRefId(),
    )

    @staticmethod
    @create_entity_action
    def new_schedule_event_in_day_for_user(
        ctx: DomainContext,
        schedule_domain_ref_id: EntityId,
        schedule_stream_ref_id: EntityId,
        name: ScheduleEventInDayName,
    ) -> "ScheduleEventInDay":
        """Create a schedule event."""
        return ScheduleEventInDay._create(
            ctx,
            schedule_domain=ParentLink(schedule_domain_ref_id),
            schedule_stream_ref_id=schedule_stream_ref_id,
            source=ScheduleStreamSource.USER,
            name=name,
            external_uid=None,
        )

    @staticmethod
    @create_entity_action
    def new_schedule_event_in_day_from_external_ical(
        ctx: DomainContext,
        schedule_domain_ref_id: EntityId,
        schedule_stream_ref_id: EntityId,
        name: ScheduleEventInDayName,
        external_uid: ScheduleExternalUid,
    ) -> "ScheduleEventInDay":
        """Create a schedule event."""
        return ScheduleEventInDay._create(
            ctx,
            schedule_domain=ParentLink(schedule_domain_ref_id),
            schedule_stream_ref_id=schedule_stream_ref_id,
            source=ScheduleStreamSource.EXTERNAL_ICAL,
            name=name,
            external_uid=external_uid,
        )

    @update_entity_action
    def change_schedule_stream(
        self,
        ctx: DomainContext,
        schedule_stream_ref_id: EntityId,
    ) -> "ScheduleEventInDay":
        """Change the schedule stream."""
        if self.source == ScheduleStreamSource.EXTERNAL_ICAL:
            raise Exception(
                "Cannot change the schedule stream of an external iCal event."
            )
        return self._new_version(
            ctx,
            schedule_stream_ref_id=schedule_stream_ref_id,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[ScheduleEventInDayName],
    ) -> "ScheduleEventInDay":
        """Update the schedule event."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
        )

    @property
    def can_be_modified_independently(self) -> bool:
        """Return whether the event can be modified independently."""
        return self.source == ScheduleStreamSource.USER
