"""Shared service for loading a vacation and its dependent entities."""

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
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.vacations.root import Vacation
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import (
    DomainUnitOfWork,
    EntityNotFoundError,
)
from jupiter.framework.use_case_io import UseCaseResultBase, use_case_result


@use_case_result
class VacationLoadResult(UseCaseResultBase):
    """VacationLoadResult."""

    vacation: Vacation
    note: Note | None
    time_event_block: TimeEventFullDaysBlock
    tags: list[Tag]
    contacts: list[Contact]
    publish_entity: PublishEntity | None


class VacationLoadService:
    """Shared service for loading a vacation and its dependent entities."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        workspace_ref_id: EntityId,
        vacation: Vacation,
        *,
        allow_archived: bool = False,
    ) -> VacationLoadResult:
        """Load a vacation together with the entities that hang off it."""
        vacation = await uow.get_for(Vacation).load_by_id(
            vacation.ref_id, allow_archived=allow_archived
        )
        owner_link = EntityLink.std(NamedEntityTag.VACATION.value, vacation.ref_id)
        notes = await uow.get_for(Note).find_all_generic(
            parent_ref_id=None,
            allow_archived=allow_archived,
            owner=owner_link,
        )
        note = notes[0] if notes else None
        time_event_blocks = await uow.get_for(
            TimeEventFullDaysBlock
        ).find_all_generic(
            parent_ref_id=None,
            allow_archived=allow_archived,
            owner=owner_link,
        )
        if not time_event_blocks:
            raise EntityNotFoundError(
                f"Could not find time event block for vacation {vacation.ref_id}"
            )
        time_event_block = time_event_blocks[0]

        publish_entity = await uow.get(PublishEntityRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.VACATION.value, vacation.ref_id),
            allow_archived=allow_archived,
        )

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=EntityLink.std(NamedEntityTag.VACATION.value, vacation.ref_id),
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
            EntityLink.std(NamedEntityTag.VACATION.value, vacation.ref_id),
        )
        if contact_link is not None:
            contacts = await uow.get_for(Contact).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=contact_link.contacts_ref_ids,
            )
        else:
            contacts = []

        return VacationLoadResult(
            vacation=vacation,
            note=note,
            time_event_block=time_event_block,
            tags=tags,
            contacts=contacts,
            publish_entity=publish_entity,
        )
