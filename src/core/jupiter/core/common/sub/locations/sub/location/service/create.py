"""Shared service for creating a location, with GPS/name dedup."""

from jupiter.core.common.sub.locations.sub.location.address_line import AddressLine
from jupiter.core.common.sub.locations.sub.location.country import CountryCode
from jupiter.core.common.sub.locations.sub.location.gps import (
    LOCATION_DEDUP_RADIUS_METERS,
    GpsCoordinates,
)
from jupiter.core.common.sub.locations.sub.location.name import LocationName
from jupiter.core.common.sub.locations.sub.location.root import (
    Location,
    LocationRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.value import CompositeValue, value


@value
class LocationCreateOutcome(CompositeValue):
    """A newly created location, or an existing one reused by dedup."""

    location: Location
    deduped: bool


class LocationCreateService:
    """Create a location, reusing a nearby similarly named one when possible."""

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        location_domain_ref_id: EntityId,
        name: LocationName | None,
        is_key: bool,
        address_line: AddressLine | None,
        country: CountryCode | None,
        gps: GpsCoordinates | None,
    ) -> LocationCreateOutcome:
        """Create a location or return a duplicate already stored nearby."""
        candidate = Location.new_location(
            ctx=ctx,
            location_domain_ref_id=location_domain_ref_id,
            name=name,
            is_key=is_key,
            address_line=address_line,
            country=country,
            gps=gps,
        )
        if candidate.gps is not None:
            lat_min, lat_max, lng_min, lng_max = candidate.gps.bounding_box()
            nearby = await uow.get(LocationRepository).find_in_gps_box(
                location_domain_ref_id,
                lat_min,
                lat_max,
                lng_min,
                lng_max,
            )
            existing = self._pick_duplicate(
                nearby,
                candidate.name,
                candidate.gps,
            )
            if existing is not None:
                return LocationCreateOutcome(location=existing, deduped=True)

        created = await uow.get_for(Location).create(candidate)
        return LocationCreateOutcome(location=created, deduped=False)

    def _pick_duplicate(
        self,
        candidates: list[Location],
        name: LocationName,
        gps: GpsCoordinates,
        *,
        radius_meters: float = LOCATION_DEDUP_RADIUS_METERS,
    ) -> Location | None:
        """Closest candidate within ``radius_meters`` whose name is similar to ``name``."""
        matches: list[tuple[float, Location]] = []
        for candidate in candidates:
            candidate_gps = candidate.gps
            if candidate_gps is None:
                continue
            distance = gps.distance_meters(candidate_gps)
            if distance > radius_meters:
                continue
            if not name.is_similar_to(candidate.name):
                continue
            matches.append((distance, candidate))
        if not matches:
            return None
        matches.sort(key=lambda item: item[0])
        return matches[0][1]
