"""Tests for location query matching."""

from jupiter.core.common.search.query import SearchQuery
from jupiter.core.common.sub.locations.resolver.resolver import location_matches_query
from jupiter.core.common.sub.locations.sub.location.address_line import AddressLine
from jupiter.core.common.sub.locations.sub.location.country import CountryCode
from jupiter.core.common.sub.locations.sub.location.gps import GpsCoordinates
from jupiter.core.common.sub.locations.sub.location.name import LocationName
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.context import DomainContext


def _location(
    name: str,
    *,
    address_line: str | None = None,
    country: str | None = None,
    gps: tuple[float, float] | None = None,
) -> Location:
    return Location.new_location(
        ctx=DomainContext(
            trace_id=TraceId.new(),
            mutation_id=MutationId.new(),
            event_source="test",
            action_timestamp=Timestamp.from_components(2024, 1, 1, 0, 0),
            _context_str="test",
        ),
        location_domain_ref_id=EntityId("1"),
        name=LocationName(name),
        address_line=AddressLine(address_line) if address_line else None,
        country=CountryCode(country) if country else None,
        gps=(
            GpsCoordinates(latitude=gps[0], longitude=gps[1])
            if gps is not None
            else None
        ),
    )


def test_matches_name() -> None:
    location = _location("Home Office")
    assert location_matches_query(location, SearchQuery("home"))
    assert not location_matches_query(location, SearchQuery("paris"))


def test_matches_address_country_and_gps() -> None:
    location = _location(
        "HQ",
        address_line="123 Main St",
        country="US",
        gps=(40.0, -74.0),
    )
    assert location_matches_query(location, SearchQuery("main"))
    assert location_matches_query(location, SearchQuery("us"))
    assert location_matches_query(location, SearchQuery("40.0"))
