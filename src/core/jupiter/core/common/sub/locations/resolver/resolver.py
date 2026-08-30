"""A location resolver for suggesting locations from an external source."""

import abc

from jupiter.core.common.search.limit import SearchLimit
from jupiter.core.common.search.query import SearchQuery
from jupiter.core.common.sub.locations.sub.location.address_line import AddressLine
from jupiter.core.common.sub.locations.sub.location.country import CountryCode
from jupiter.core.common.sub.locations.sub.location.gps import GpsCoordinates
from jupiter.core.common.sub.locations.sub.location.name import LocationName
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.framework.value import CompositeValue, value


@value
class LocationResolverCandidate(CompositeValue):
    """A location suggested by a resolver, not yet stored in the workspace."""

    name: LocationName
    address_line: AddressLine | None
    country: CountryCode | None
    gps: GpsCoordinates | None
    source: str
    source_id: str | None


@value
class LocationResolverMatchesPage(CompositeValue):
    """One page of resolver candidates."""

    candidates: list[LocationResolverCandidate]


def location_matches_query(location: Location, query: SearchQuery) -> bool:
    """Whether a stored location matches a free-form query."""
    needle = str(query).casefold()
    haystack_parts = [str(location.name)]
    if location.address_line is not None:
        haystack_parts.append(str(location.address_line))
    if location.country is not None:
        haystack_parts.append(str(location.country))
    if location.gps is not None:
        haystack_parts.append(str(location.gps))
    return needle in " ".join(haystack_parts).casefold()


class LocationResolver(abc.ABC):
    """Suggests locations from an external source.

    Implementations are chosen via ``WEBAPI_LOCATION_RESOLVER`` (see ADR 0008),
    the same blend style as ``WEBAPI_SEARCH``.
    """

    @abc.abstractmethod
    async def resolve(
        self,
        query: SearchQuery,
        limit: SearchLimit,
    ) -> LocationResolverMatchesPage:
        """Return candidate locations for ``query``."""
