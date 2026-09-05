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


def _lat_lng_from_gps(
    gps: GpsCoordinates | None,
) -> tuple[float | None, float | None]:
    if gps is None:
        return None, None
    return gps.latitude, gps.longitude


@entity("LocationDomain")
class Location(LeafSupportEntity):
    """A location."""

    location_domain: ParentLink
    name: LocationName
    is_key: bool
    address_line: AddressLine | None
    country: CountryCode | None
    lat: float | None
    lng: float | None

    @property
    def gps(self) -> GpsCoordinates | None:
        """GPS coordinates reconstructed from lat/lng columns."""
        if self.lat is None or self.lng is None:
            return None
        return GpsCoordinates(latitude=self.lat, longitude=self.lng)

    @staticmethod
    @create_entity_action
    def new_location(
        ctx: DomainContext,
        location_domain_ref_id: EntityId,
        name: LocationName | None,
        is_key: bool,
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
        lat, lng = _lat_lng_from_gps(gps)
        return Location._create(
            ctx,
            location_domain=ParentLink(location_domain_ref_id),
            name=resolved_name,
            is_key=is_key,
            address_line=address_line,
            country=country,
            lat=lat,
            lng=lng,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[LocationName | None],
        is_key: UpdateAction[bool],
        address_line: UpdateAction[AddressLine | None],
        country: UpdateAction[CountryCode | None],
        gps: UpdateAction[GpsCoordinates | None],
    ) -> "Location":
        """Update the location."""
        new_address_line = address_line.or_else(self.address_line)
        new_country = country.or_else(self.country)
        new_gps = gps.or_else(self.gps)
        new_lat, new_lng = _lat_lng_from_gps(new_gps)

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
            is_key=is_key.or_else(self.is_key),
            address_line=new_address_line,
            country=new_country,
            lat=new_lat,
            lng=new_lng,
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

    @abc.abstractmethod
    async def find_in_gps_box(
        self,
        parent_ref_id: EntityId,
        lat_min: float,
        lat_max: float,
        lng_min: float,
        lng_max: float,
        *,
        allow_archived: bool = False,
    ) -> list[Location]:
        """Find locations whose lat/lng fall inside an axis-aligned bounding box."""
