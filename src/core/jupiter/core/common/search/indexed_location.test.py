"""Tests for denormalized location search fields."""

from jupiter.core.common.search.indexed_location import IndexedLocation
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


def _ctx() -> DomainContext:
    return DomainContext(
        trace_id=TraceId.new(),
        mutation_id=MutationId.new(),
        event_source="test",
        action_timestamp=Timestamp.from_components(2024, 1, 1, 0, 0),
        _context_str="test",
    )


def test_indexed_location_none() -> None:
    fields = IndexedLocation.from_locations([])
    assert fields.name == ""
    assert fields.address == ""
    assert fields.country == ""
    assert fields.gps == ""
    assert fields.ref_ids == []


def test_indexed_location_all_fields() -> None:
    location = Location.new_location(
        ctx=_ctx(),
        location_domain_ref_id=EntityId("1"),
        name=LocationName("Cafe Central"),
        is_key=False,
        address_line=AddressLine("Herrengasse 14"),
        country=CountryCode("AT"),
        gps=GpsCoordinates(latitude=48.210033, longitude=16.363449),
    )
    location = location.assign_ref_id(EntityId("42"))

    fields = IndexedLocation.from_locations([location])
    assert fields.name == "Cafe Central"
    assert fields.address == "Herrengasse 14"
    assert fields.country == "AT"
    assert fields.gps == "48.210033, 16.363449"
    assert fields.ref_ids == [EntityId("42")]


def test_indexed_location_name_only() -> None:
    location = Location.new_location(
        ctx=_ctx(),
        location_domain_ref_id=EntityId("1"),
        name=LocationName("Home"),
        is_key=False,
        address_line=None,
        country=None,
        gps=None,
    )
    location = location.assign_ref_id(EntityId("7"))

    fields = IndexedLocation.from_locations([location])
    assert fields.name == "Home"
    assert fields.address == ""
    assert fields.country == ""
    assert fields.gps == ""
    assert fields.ref_ids == [EntityId("7")]


def test_indexed_location_multiple() -> None:
    first = Location.new_location(
        ctx=_ctx(),
        location_domain_ref_id=EntityId("1"),
        name=LocationName("Paris"),
        is_key=False,
        address_line=AddressLine("1 Rue de Rivoli"),
        country=CountryCode("FR"),
        gps=None,
    ).assign_ref_id(EntityId("8"))
    second = Location.new_location(
        ctx=_ctx(),
        location_domain_ref_id=EntityId("1"),
        name=LocationName("Rome"),
        is_key=False,
        address_line=None,
        country=CountryCode("IT"),
        gps=None,
    ).assign_ref_id(EntityId("9"))

    fields = IndexedLocation.from_locations([first, second])
    assert fields.name == "Paris Rome"
    assert fields.address == "1 Rue de Rivoli"
    assert fields.country == "FR IT"
    assert fields.gps == ""
    assert fields.ref_ids == [EntityId("8"), EntityId("9")]
