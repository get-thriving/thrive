"""Locations domain trunk entity."""

from jupiter.core.common.sub.locations.sub.link.root import LocationLink
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    entity,
)


@entity("Workspace")
class LocationDomain(TrunkEntity):
    """Locations trunk entity."""

    workspace: ParentLink

    locations = ContainsMany(Location, location_domain_ref_id=IsRefId())
    links = ContainsMany(LocationLink, location_domain_ref_id=IsRefId())

    @staticmethod
    def new_location_domain(
        ctx: DomainContext,
        workspace_ref_id: EntityId,
    ) -> "LocationDomain":
        """Create a locations domain."""
        return LocationDomain._create(ctx, workspace=ParentLink(workspace_ref_id))
