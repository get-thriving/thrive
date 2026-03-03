"""A contact."""

import abc

from jupiter.core.common.sub.contacts.sub.contact.name import ContactName
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    LeafSupportEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.storage.repository import (
    EntityAlreadyExistsError,
    LeafEntityRepository,
)
from jupiter.framework.update_action import UpdateAction


class ContactAlreadyExistsError(EntityAlreadyExistsError):
    """Error raised when a contact already exists."""


@entity
class Contact(LeafSupportEntity):
    """A contact."""

    contact_domain: ParentLink
    name: ContactName

    @staticmethod
    @create_entity_action
    def new_contact(
        ctx: MutationContext,
        contact_domain_ref_id: EntityId,
        name: ContactName,
    ) -> "Contact":
        """Create a contact."""
        return Contact._create(
            ctx,
            contact_domain=ParentLink(contact_domain_ref_id),
            name=name,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        name: UpdateAction[ContactName],
    ) -> "Contact":
        """Update the contact."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
        )


class ContactRepository(LeafEntityRepository[Contact], abc.ABC):
    """The repository for contacts."""

    @abc.abstractmethod
    async def get_by_name(
        self,
        contact_domain_ref_id: EntityId,
        name: ContactName,
    ) -> Contact:
        """Load a contact by its domain and name."""
