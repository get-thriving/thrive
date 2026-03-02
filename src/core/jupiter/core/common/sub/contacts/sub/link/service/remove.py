"""Shared service for removing a contact link."""

from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.sub.link.root import (
    ContactLink,
    ContactLinkRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class ContactLinkRemoveService:
    """A service for removing a contact link."""

    async def remove_for_entity(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        namespace: ContactNamespace,
        source_entity_ref_id: EntityId,
    ) -> None:
        """Remove a contact link."""
        contact_link = await uow.get(
            ContactLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=namespace,
            source_entity_ref_id=source_entity_ref_id,
        )
        if contact_link is None:
            return
        await uow.get_for(ContactLink).remove(contact_link.ref_id)
