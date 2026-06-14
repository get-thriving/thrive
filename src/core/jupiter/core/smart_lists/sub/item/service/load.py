"""Shared service for loading a smart list item."""

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
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.smart_lists.sub.item.root import SmartListItem
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import UseCaseResultBase, use_case_result


@use_case_result
class SmartListItemLoadResult(UseCaseResultBase):
    """SmartListItemLoadResult."""

    item: SmartListItem
    generic_tags: list[Tag]
    contacts: list[Contact]
    note: Note | None
    publish_entity: PublishEntity | None


class SmartListItemLoadService:
    """Shared service for loading a smart list item."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        workspace_ref_id: EntityId,
        item: SmartListItem,
        *,
        allow_archived: bool = False,
        include_publish_entity: bool = True,
    ) -> SmartListItemLoadResult:
        """Load a smart list item and its dependent entities."""
        item = await uow.get_for(SmartListItem).load_by_id(
            item.ref_id, allow_archived=allow_archived
        )
        notes = await uow.get_for(Note).find_all_generic(
            parent_ref_id=None,
            allow_archived=allow_archived,
            owner=EntityLink.std(NamedEntityTag.SMART_LIST_ITEM.value, item.ref_id),
        )
        note = notes[0] if notes else None

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=EntityLink.std(NamedEntityTag.SMART_LIST_ITEM.value, item.ref_id),
        )
        if tag_link is not None:
            generic_tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            generic_tags = []

        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            workspace_ref_id,
        )
        contact_link = await uow.get(ContactLinkRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.SMART_LIST_ITEM.value, item.ref_id),
        )
        if contact_link is not None:
            contacts = await uow.get_for(Contact).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=contact_link.contacts_ref_ids,
            )
        else:
            contacts = []

        publish_entity = None
        if include_publish_entity:
            publish_entity = await uow.get(
                PublishEntityRepository
            ).load_optional_for_owner(
                EntityLink.std(NamedEntityTag.SMART_LIST_ITEM.value, item.ref_id),
                allow_archived=allow_archived,
            )

        return SmartListItemLoadResult(
            item=item,
            generic_tags=generic_tags,
            contacts=contacts,
            note=note,
            publish_entity=publish_entity,
        )
