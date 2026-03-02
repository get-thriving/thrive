"""A link between an entity and its contacts."""

import abc

from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import NOT_USED_NAME
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    IsOneOfRefId,
    LeafSupportEntity,
    ParentLink,
    RefsMany,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction


@entity
class ContactLink(LeafSupportEntity):
    """A link between an entity and its contacts."""

    contact_domain: ParentLink

    namespace: ContactNamespace
    source_entity_ref_id: EntityId
    contacts_ref_ids: list[EntityId]

    contacts = RefsMany(Contact, ref_id=IsOneOfRefId("contacts_ref_ids"))

    @staticmethod
    @create_entity_action
    def new_contact_link(
        ctx: MutationContext,
        contact_domain_ref_id: EntityId,
        namespace: ContactNamespace,
        source_entity_ref_id: EntityId,
        contacts_ref_ids: list[EntityId],
    ) -> "ContactLink":
        """Create a new contact link."""
        return ContactLink._create(
            ctx,
            name=NOT_USED_NAME,
            contact_domain=ParentLink(contact_domain_ref_id),
            namespace=namespace,
            source_entity_ref_id=source_entity_ref_id,
            contacts_ref_ids=contacts_ref_ids,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        contacts_ref_ids: UpdateAction[list[EntityId]],
    ) -> "ContactLink":
        """Update the contact link."""
        return self._new_version(
            ctx,
            name=NOT_USED_NAME,
            contacts_ref_ids=contacts_ref_ids.or_else(self.contacts_ref_ids),
        )


class ContactLinkRepository(LeafEntityRepository[ContactLink], abc.ABC):
    """The repository for contact links."""

    @abc.abstractmethod
    async def upsert(self, contact_link: ContactLink) -> ContactLink:
        """Upsert a contact link."""

    @abc.abstractmethod
    async def load_optional_for_namespace_and_source(
        self,
        namespace: ContactNamespace,
        source_entity_ref_id: EntityId,
    ) -> ContactLink | None:
        """Load a contact link by its namespace and source entity reference ID."""
