"""A location."""

import abc

from jupiter.core.common.sub.locations.sub.location.address_line import AddressLine
from jupiter.core.common.sub.locations.sub.location.country import CountryCode
from jupiter.core.common.sub.locations.sub.location.gps import GpsCoordinates
from jupiter.core.common.sub.locations.sub.location.name import LocationName
from jupiter.framework.base.entity_id import EntityId
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


def _derive_location_name(
    address_line: AddressLine | None,
    country: CountryCode | None,
    gps: GpsCoordinates | None,
) -> LocationName:
    """Derive a display name from the other location fields."""
    if address_line is not None:
        return LocationName(str(address_line))
    if country is not None:
        return LocationName(str(country))
    if gps is not None:
        return LocationName(str(gps))
    raise InputValidationError(
        "At least one of name, address line, country, or GPS coordinates must be provided",
    )


@entity("LocationDomain")
class Location(LeafSupportEntity):
    """A location."""

    location_domain: ParentLink
    name: LocationName
    address_line: AddressLine | None
    country: CountryCode | None
    gps: GpsCoordinates | None

    @staticmethod
    @create_entity_action
    def new_location(
        ctx: DomainContext,
        location_domain_ref_id: EntityId,
        name: LocationName | None,
        address_line: AddressLine | None,
        country: CountryCode | None,
        gps: GpsCoordinates | None,
    ) -> "Location":
        """Create a location."""
        if name is None and address_line is None and country is None and gps is None:
            raise InputValidationError(
                "At least one of name, address line, country, or GPS coordinates must be provided",
            )
        resolved_name = name or _derive_location_name(address_line, country, gps)
        return Location._create(
            ctx,
            location_domain=ParentLink(location_domain_ref_id),
            name=resolved_name,
            address_line=address_line,
            country=country,
            gps=gps,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[LocationName | None],
        address_line: UpdateAction[AddressLine | None],
        country: UpdateAction[CountryCode | None],
        gps: UpdateAction[GpsCoordinates | None],
    ) -> "Location":
        """Update the location."""
        new_address_line = address_line.or_else(self.address_line)
        new_country = country.or_else(self.country)
        new_gps = gps.or_else(self.gps)

        if name.should_change:
            if name.just_the_value is not None:
                new_name = name.just_the_value
            else:
                new_name = _derive_location_name(new_address_line, new_country, new_gps)
        else:
            new_name = self.name

        return self._new_version(
            ctx,
            name=new_name,
            address_line=new_address_line,
            country=new_country,
            gps=new_gps,
        )


class LocationRepository(LeafEntityRepository[Location], abc.ABC):
    """The repository for locations."""

    @abc.abstractmethod
    async def search(
        self,
        parent_ref_id: EntityId,
        query: str,
        limit: int,
        *,
        allow_archived: bool = False,
    ) -> list[Location]:
        """Find locations whose name, address, country, or GPS text contains ``query``."""
