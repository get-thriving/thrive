"""Shared service for loading a schedule event in day."""

from jupiter.core.application.fast_info_repository import ScheduleStreamSummary
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.publish.sub.entity.root import (
    PublishEntity,
    PublishEntityRepository,
)
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.schedule.sub.event_in_day.root import ScheduleEventInDay
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import (
    DomainUnitOfWork,
    EntityNotFoundError,
)
from jupiter.framework.use_case_io import UseCaseResultBase, use_case_result


@use_case_result
class ScheduleEventInDayLoadResult(UseCaseResultBase):
    """ScheduleEventInDayLoadResult."""

    schedule_event_in_day: ScheduleEventInDay
    time_event_in_day_block: TimeEventInDayBlock
    note: Note | None
    tags: list[Tag]
    contacts: list[Contact]
    schedule_stream: ScheduleStreamSummary
    publish_entity: PublishEntity | None


class ScheduleEventInDayLoadService:
    """Shared service for loading a schedule event in day."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        workspace_ref_id: EntityId,
        schedule_event_in_day: ScheduleEventInDay,
        *,
        allow_archived: bool = False,
        include_publish_entity: bool = True,
    ) -> ScheduleEventInDayLoadResult:
        """Load a schedule event in day and its dependent entities."""
        schedule_event_in_day = await uow.get_for(ScheduleEventInDay).load_by_id(
            schedule_event_in_day.ref_id, allow_archived=allow_archived
        )
        owner_link = EntityLink.std(
            NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,
            schedule_event_in_day.ref_id,
        )
        time_event_in_day_blocks = await uow.get_for(
            TimeEventInDayBlock
        ).find_all_generic(
            parent_ref_id=None,
            allow_archived=allow_archived,
            owner=owner_link,
        )
        if not time_event_in_day_blocks:
            raise EntityNotFoundError(
                f"Could not find time event block for schedule event {schedule_event_in_day.ref_id}"
            )
        time_event_in_day_block = time_event_in_day_blocks[0]
        notes = await uow.get_for(Note).find_all_generic(
            parent_ref_id=None,
            allow_archived=allow_archived,
            owner=owner_link,
        )
        note = notes[0] if notes else None

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=EntityLink.std(
                NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value, schedule_event_in_day.ref_id
            ),
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []

        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            workspace_ref_id,
        )
        contact_link = await uow.get(ContactLinkRepository).load_optional_for_owner(
            EntityLink.std(
                NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,
                schedule_event_in_day.ref_id,
            ),
        )
        if contact_link is not None:
            contacts = await uow.get_for(Contact).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=contact_link.contacts_ref_ids,
            )
        else:
            contacts = []

        schedule_stream = await uow.get_for(ScheduleStream).load_by_id(
            schedule_event_in_day.schedule_stream_ref_id,
        )

        publish_entity = None
        if include_publish_entity:
            publish_entity = await uow.get(
                PublishEntityRepository
            ).load_optional_for_owner(
                EntityLink.std(
                    NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,
                    schedule_event_in_day.ref_id,
                ),
                allow_archived=allow_archived,
            )

        return ScheduleEventInDayLoadResult(
            schedule_event_in_day=schedule_event_in_day,
            time_event_in_day_block=time_event_in_day_block,
            note=note,
            tags=tags,
            contacts=contacts,
            schedule_stream=ScheduleStreamSummary(
                ref_id=schedule_stream.ref_id,
                source=schedule_stream.source,
                name=schedule_stream.name,
                color=schedule_stream.color,
            ),
            publish_entity=publish_entity,
        )
