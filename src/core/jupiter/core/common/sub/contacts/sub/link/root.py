"""A link between an entity and its contacts."""

import abc
from typing import Final

from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.base.entity_name import NOT_USED_NAME
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsOneOfRefId,
    LeafSupportEntity,
    ParentLink,
    RefsMany,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction

# Allowed ``EntityLink.the_type`` values for :class:`ContactLink` owners.
ALLOWED_CONTACT_LINK_OWNER_TYPES: Final[frozenset[str]] = frozenset(
    {
        NamedEntityTag.TODO_TASK.value,
        NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,
        NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
        NamedEntityTag.HABIT.value,
        NamedEntityTag.CHORE.value,
        NamedEntityTag.PROJECT.value,
        NamedEntityTag.VACATION.value,
        NamedEntityTag.SMART_LIST_ITEM.value,
        NamedEntityTag.METRIC_ENTRY.value,
        NamedEntityTag.PERSON.value,
    }
)


@entity("ContactDomain")
class ContactLink(LeafSupportEntity):
    """A link between an entity and its contacts."""

    contact_domain: ParentLink

    owner: EntityLink
    contacts_ref_ids: list[EntityId]

    contacts = RefsMany(Contact, ref_id=IsOneOfRefId("contacts_ref_ids"))

    @staticmethod
    @create_entity_action
    def new_contact_link(
        ctx: DomainContext,
        contact_domain_ref_id: EntityId,
        owner: EntityLink,
        contacts_ref_ids: list[EntityId],
    ) -> "ContactLink":
        """Create a new contact link."""
        if owner.the_type not in ALLOWED_CONTACT_LINK_OWNER_TYPES:
            raise InputValidationError(
                f"Invalid contact link owner entity type: {owner.the_type!r}",
            )
        if owner.purpose != "std":
            raise InputValidationError(
                f"Contact link owner purpose must be 'std', got {owner.purpose!r}",
            )
        return ContactLink._create(
            ctx,
            name=NOT_USED_NAME,
            contact_domain=ParentLink(contact_domain_ref_id),
            owner=owner,
            contacts_ref_ids=contacts_ref_ids,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
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
    async def load_optional_for_owner(
        self,
        owner: EntityLink,
    ) -> ContactLink | None:
        """Load a contact link by its owner link."""
