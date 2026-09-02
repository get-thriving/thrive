"""A link between an entity and its locations."""

import abc
from typing import Final

from jupiter.core.common.sub.locations.sub.location.root import Location
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

# Only vacations may attach more than one location.
OWNERS_ALLOWING_MULTIPLE_LOCATIONS: Final[frozenset[str]] = frozenset(
    {
        NamedEntityTag.VACATION.value,
    }
)


@entity("LocationDomain")
class LocationLink(LeafSupportEntity):
    """A link between an entity and its locations."""

    location_domain: ParentLink

    owner: EntityLink
    locations_ref_ids: list[EntityId]

    locations = RefsMany(Location, ref_id=IsOneOfRefId("locations_ref_ids"))

    @staticmethod
    def _normalized_locations_ref_ids(
        owner: EntityLink, locations_ref_ids: list[EntityId]
    ) -> list[EntityId]:
        unique_location_ref_ids = list(dict.fromkeys(locations_ref_ids))
        if (
            owner.the_type not in OWNERS_ALLOWING_MULTIPLE_LOCATIONS
            and len(unique_location_ref_ids) > 1
        ):
            raise InputValidationError(
                "Only vacations can be associated with multiple locations"
            )
        return unique_location_ref_ids

    @staticmethod
    @create_entity_action
    def new_location_link(
        ctx: DomainContext,
        location_domain_ref_id: EntityId,
        owner: EntityLink,
        locations_ref_ids: list[EntityId],
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
            locations_ref_ids=LocationLink._normalized_locations_ref_ids(
                owner, locations_ref_ids
            ),
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        locations_ref_ids: UpdateAction[list[EntityId]],
    ) -> "LocationLink":
        """Update the location link."""
        return self._new_version(
            ctx,
            name=NOT_USED_NAME,
            locations_ref_ids=self._normalized_locations_ref_ids(
                self.owner, locations_ref_ids.or_else(self.locations_ref_ids)
            ),
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

    @abc.abstractmethod
    async def find_all_containing_location(
        self,
        parent_ref_id: EntityId,
        location_ref_id: EntityId,
        *,
        allow_archived: bool = False,
    ) -> list[LocationLink]:
        """Find location links whose ``locations_ref_ids`` include ``location_ref_id``."""
