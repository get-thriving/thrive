"""A link between an entity and its location."""

import abc
from typing import Final

from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.base.entity_name import NOT_USED_NAME
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    LeafSupportEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction

# Allowed ``EntityLink.the_type`` values for :class:`LocationLink` owners.
ALLOWED_LOCATION_LINK_OWNER_TYPES: Final[frozenset[str]] = frozenset(
    {
        NamedEntityTag.TODO_TASK.value,
        NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,
        NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
        NamedEntityTag.HABIT.value,
        NamedEntityTag.CHORE.value,
        NamedEntityTag.BIG_PLAN.value,
        NamedEntityTag.VACATION.value,
        NamedEntityTag.DOC.value,
        NamedEntityTag.SMART_LIST_ITEM.value,
        NamedEntityTag.PERSON.value,
    }
)


@entity("LocationDomain")
class LocationLink(LeafSupportEntity):
    """A link between an entity and a single location."""

    location_domain: ParentLink

    owner: EntityLink
    location_ref_id: EntityId | None

    @staticmethod
    @create_entity_action
    def new_location_link(
        ctx: DomainContext,
        location_domain_ref_id: EntityId,
        owner: EntityLink,
        location_ref_id: EntityId | None,
    ) -> "LocationLink":
        """Create a new location link."""
        if owner.the_type not in ALLOWED_LOCATION_LINK_OWNER_TYPES:
            raise InputValidationError(
                f"Invalid location link owner entity type: {owner.the_type!r}",
            )
        if owner.purpose != "std":
            raise InputValidationError(
                f"Location link owner purpose must be 'std', got {owner.purpose!r}",
            )
        return LocationLink._create(
            ctx,
            name=NOT_USED_NAME,
            location_domain=ParentLink(location_domain_ref_id),
            owner=owner,
            location_ref_id=location_ref_id,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        location_ref_id: UpdateAction[EntityId | None],
    ) -> "LocationLink":
        """Update the location link."""
        return self._new_version(
            ctx,
            name=NOT_USED_NAME,
            location_ref_id=location_ref_id.or_else(self.location_ref_id),
        )


class LocationLinkRepository(LeafEntityRepository[LocationLink], abc.ABC):
    """The repository for location links."""

    @abc.abstractmethod
    async def upsert(self, location_link: LocationLink) -> LocationLink:
        """Upsert a location link."""

    @abc.abstractmethod
    async def load_optional_for_owner(
        self,
        owner: EntityLink,
    ) -> LocationLink | None:
        """Load a location link by its owner link."""
