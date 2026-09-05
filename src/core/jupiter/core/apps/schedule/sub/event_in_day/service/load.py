"""Shared service for loading a schedule event in day."""

from jupiter.core.application.fast_info_repository import ScheduleStreamSummary
from jupiter.core.apps.schedule.sub.event_in_day.root import ScheduleEventInDay
from jupiter.core.apps.schedule.sub.stream.root import ScheduleStream
from jupiter.core.common.sub.access.sub.grant.service.get_access_level_for_entity import (
    GetAccessLevelForEntityService,
)
from jupiter.core.common.sub.access.sub.grant.service.load_user_that_owns_entity import (
    LoadUserThatOwnsEntityService,
)
from jupiter.core.common.sub.access.sub.status.root import AccessStatus
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.locations.sub.link.root import LocationLinkRepository
from jupiter.core.common.sub.locations.sub.link.service.load import (
    LoadLocationForLinkService,
)
from jupiter.core.common.sub.locations.sub.location.root import Location
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
from jupiter.core.crown_entity_reader import CrownEntityReader
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.users.user_light import UserLight
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
    location: Location | None
    schedule_stream: ScheduleStreamSummary
    publish_entity: PublishEntity | None
    owner: UserLight
    access_status: AccessStatus | None


class ScheduleEventInDayLoadService:
    """Shared service for loading a schedule event in day."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        workspace_ref_id: EntityId,
        schedule_event_in_day: ScheduleEventInDay,
        *,
        crown_entity_reader: CrownEntityReader,
        user_ref_id: EntityId | None = None,
        allow_archived: bool = False,
        include_publish_entity: bool = True,
    ) -> ScheduleEventInDayLoadResult:
        """Load a schedule event in day and its dependent entities."""
        schedule_event_in_day = await crown_entity_reader.load_entity(
            ScheduleEventInDay,
            schedule_event_in_day.ref_id,
            allow_archived=allow_archived,
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
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []

        contact_link = await uow.get(ContactLinkRepository).load_optional_for_owner(
            EntityLink.std(
                NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,
                schedule_event_in_day.ref_id,
            ),
        )
        if contact_link is not None:
            contacts = await uow.get_for(Contact).find_all_generic(
                allow_archived=False,
                ref_id=contact_link.contacts_ref_ids,
            )
        else:
            contacts = []

        location_link = await uow.get(LocationLinkRepository).load_optional_for_owner(
            EntityLink.std(
                NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,
                schedule_event_in_day.ref_id,
            ),
        )
        location = await LoadLocationForLinkService().do_it(uow, location_link)

        # Dependent of the event; load without ACL so event-only grants still work.
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

        owner = await LoadUserThatOwnsEntityService().do_it(uow, owner_link)
        access_status = (
            await GetAccessLevelForEntityService().do_it(uow, owner_link, user_ref_id)
            if user_ref_id is not None
            else None
        )

        return ScheduleEventInDayLoadResult(
            schedule_event_in_day=schedule_event_in_day,
            time_event_in_day_block=time_event_in_day_block,
            note=note,
            tags=tags,
            contacts=contacts,
            location=location,
            schedule_stream=ScheduleStreamSummary(
                ref_id=schedule_stream.ref_id,
                source=schedule_stream.source,
                name=schedule_stream.name,
                color=schedule_stream.color,
            ),
            publish_entity=publish_entity,
            owner=owner,
            access_status=access_status,
        )
