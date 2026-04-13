"""Shared service for removing a contact link."""

from jupiter.core.common.sub.contacts.sub.link.root import (
    ContactLink,
    ContactLinkRepository,
)
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class ContactLinkRemoveService:
    """A service for removing a contact link."""

    async def remove_for_entity(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        owner: EntityLink,
    ) -> None:
        """Remove a contact link."""
        contact_link = await uow.get(ContactLinkRepository).load_optional_for_owner(
            owner=owner,
        )
        if contact_link is None:
            return
        await uow.get_for(ContactLink).remove(ctx, contact_link.ref_id)
