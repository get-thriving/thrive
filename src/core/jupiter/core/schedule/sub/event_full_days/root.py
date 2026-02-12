"""A full day block in a schedule."""

from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.common.sub.time_events.namespace import (
    TimeEventNamespace,
)
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.schedule.sub.event_full_days.name import ScheduleEventFullDaysName
from jupiter.core.schedule.sub.external_sync_log.external_uid import (
    ScheduleExternalUid,
)
from jupiter.core.schedule.sub.stream.source import ScheduleStreamSource
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
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


@entity
class ScheduleEventFullDays(LeafEntity):
    """A full day block in a schedule."""

    schedule_domain: ParentLink

    schedule_stream_ref_id: EntityId
    source: ScheduleStreamSource
    name: ScheduleEventFullDaysName
    external_uid: ScheduleExternalUid | None

    time_event_full_days_block = OwnsOne(
        TimeEventFullDaysBlock,
        namespace=TimeEventNamespace.SCHEDULE_FULL_DAYS_BLOCK,
        source_entity_ref_id=IsRefId(),
    )
    tag_link = OwnsAtMostOne(
        TagLink,
        namespace=TagNamespace.SCHEDULE_EVENT_FULL_DAYS_BLOCK,
        source_entity_ref_id=IsRefId(),
    )
    note = OwnsAtMostOne(
        Note,
        namespace=NoteNamespace.SCHEDULE_EVENT_FULL_DAYS,
        source_entity_ref_id=IsRefId(),
    )

    @staticmethod
    @create_entity_action
    def new_schedule_full_days_block_for_user(
        ctx: MutationContext,
        schedule_domain_ref_id: EntityId,
        schedule_stream_ref_id: EntityId,
        name: ScheduleEventFullDaysName,
    ) -> "ScheduleEventFullDays":
        """Create a schedule event."""
        return ScheduleEventFullDays._create(
            ctx,
            schedule_domain=ParentLink(schedule_domain_ref_id),
            schedule_stream_ref_id=schedule_stream_ref_id,
            source=ScheduleStreamSource.USER,
            name=name,
            external_uid=None,
        )

    @staticmethod
    @create_entity_action
    def new_schedule_full_days_block_from_external_ical(
        ctx: MutationContext,
        schedule_domain_ref_id: EntityId,
        schedule_stream_ref_id: EntityId,
        name: ScheduleEventFullDaysName,
        external_uid: ScheduleExternalUid,
    ) -> "ScheduleEventFullDays":
        """Create a schedule event from an external iCal."""
        return ScheduleEventFullDays._create(
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
        ctx: MutationContext,
        schedule_stream_ref_id: EntityId,
    ) -> "ScheduleEventFullDays":
        """Change the schedule stream."""
        if self.source == ScheduleStreamSource.EXTERNAL_ICAL:
            raise Exception("Cannot change schedule stream for external iCal event.")
        return self._new_version(
            ctx,
            schedule_stream_ref_id=schedule_stream_ref_id,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        name: UpdateAction[ScheduleEventFullDaysName],
    ) -> "ScheduleEventFullDays":
        """Update the schedule event."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
        )

    @property
    def can_be_modified_independently(self) -> bool:
        """Return whether the event can be modified independently."""
        return self.source == ScheduleStreamSource.USER
