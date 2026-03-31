"""Contacts domain trunk entity."""

from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    entity,
)


@entity
class ContactDomain(TrunkEntity):
    """Contacts trunk entity."""

    workspace: ParentLink

    contacts = ContainsMany(Contact, contact_domain_ref_id=IsRefId())
    links = ContainsMany(ContactLink, contact_domain_ref_id=IsRefId())

    @staticmethod
    def new_contact_domain(
        ctx: DomainContext,
        workspace_ref_id: EntityId,
    ) -> "ContactDomain":
        """Create a contacts domain."""
        return ContactDomain._create(ctx, workspace=ParentLink(workspace_ref_id))
