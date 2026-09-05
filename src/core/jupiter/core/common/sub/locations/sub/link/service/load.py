"""Load locations associated with a location link."""

from jupiter.core.common.sub.locations.sub.link.root import LocationLink
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.framework.storage.repository import DomainUnitOfWork


class LoadLocationsForLinkService:
    """Load the locations referenced by a location link, preserving link order."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        location_link: LocationLink | None,
        *,
        allow_archived: bool = False,
    ) -> list[Location]:
        """Return linked locations, or an empty list when there is no link."""
        if location_link is None or not location_link.locations_ref_ids:
            return []
        locations = await uow.get_for(Location).find_all_generic(
            allow_archived=allow_archived,
            ref_id=location_link.locations_ref_ids,
        )
        locations_by_ref_id = {location.ref_id: location for location in locations}
        return [
            locations_by_ref_id[ref_id]
            for ref_id in location_link.locations_ref_ids
            if ref_id in locations_by_ref_id
        ]


class LoadLocationForLinkService:
    """Load the single location referenced by a location link, if any."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        location_link: LocationLink | None,
        *,
        allow_archived: bool = False,
    ) -> Location | None:
        """Return the first linked location, or None when there is no link."""
        locations = await LoadLocationsForLinkService().do_it(
            uow, location_link, allow_archived=allow_archived
        )
        return locations[0] if locations else None
