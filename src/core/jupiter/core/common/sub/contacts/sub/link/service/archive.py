"""Shared service for archiving a contact link."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.contacts.sub.link.root import (
    ContactLink,
    ContactLinkRepository,
)
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class ContactLinkArchiveService:
    """A service for archiving a contact link."""

    async def archive_for_entity(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        owner: EntityLink,
        archival_reason: JupiterArchivalReason,
    ) -> None:
        """Archive a contact link for an entity."""
        contact_link = await uow.get(ContactLinkRepository).load_optional_for_owner(
            owner=owner,
        )
        if contact_link is None:
            return
        if contact_link.archived:
            return
        contact_link = contact_link.mark_archived(ctx, archival_reason)
        await uow.get_for(ContactLink).save(contact_link)
