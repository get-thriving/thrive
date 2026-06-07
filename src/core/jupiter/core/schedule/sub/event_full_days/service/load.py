"""Shared service for loading a schedule full days event."""

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
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.application.fast_info_repository import ScheduleStreamSummary
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.schedule.sub.event_full_days.root import ScheduleEventFullDays
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import UseCaseResultBase, use_case_result
from jupiter.framework.utils.generic_loader import generic_loader


@use_case_result
class ScheduleEventFullDaysLoadResult(UseCaseResultBase):
    """ScheduleEventFullDaysLoadResult."""

    schedule_event_full_days: ScheduleEventFullDays
    time_event_full_days_block: TimeEventFullDaysBlock
    note: Note | None
    tags: list[Tag]
    contacts: list[Contact]
    schedule_stream: ScheduleStreamSummary
    publish_entity: PublishEntity | None


class ScheduleEventFullDaysLoadService:
    """Shared service for loading a schedule full days event."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        workspace_ref_id: EntityId,
        schedule_event_full_days: ScheduleEventFullDays,
        *,
        allow_archived: bool = False,
        include_publish_entity: bool = True,
    ) -> ScheduleEventFullDaysLoadResult:
        """Load a schedule full days event and its dependent entities."""
        (
            schedule_event_full_days,
            time_event_full_days_block,
            note,
        ) = await generic_loader(
            uow,
            ScheduleEventFullDays,
            schedule_event_full_days.ref_id,
            ScheduleEventFullDays.time_event_full_days_block,
            ScheduleEventFullDays.note,
            allow_archived=allow_archived,
        )

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=EntityLink.std(
                NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
                schedule_event_full_days.ref_id,
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
                NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
                schedule_event_full_days.ref_id,
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
            schedule_event_full_days.schedule_stream_ref_id,
        )

        publish_entity = None
        if include_publish_entity:
            publish_entity = await uow.get(
                PublishEntityRepository
            ).load_optional_for_owner(
                EntityLink.std(
                    NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
                    schedule_event_full_days.ref_id,
                ),
                allow_archived=allow_archived,
            )

        return ScheduleEventFullDaysLoadResult(
            schedule_event_full_days=schedule_event_full_days,
            time_event_full_days_block=time_event_full_days_block,
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
