"""Tests for location create-or-dedup matching."""

from jupiter.core.common.sub.locations.sub.location.gps import GpsCoordinates
from jupiter.core.common.sub.locations.sub.location.name import LocationName
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.core.common.sub.locations.sub.location.service.create import (
    LocationCreateService,
)
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


def _location(
    name: str,
    latitude: float,
    longitude: float,
    ref_id: str = "1",
) -> Location:
    location = Location.new_location(
        ctx=_ctx(),
        location_domain_ref_id=EntityId("1"),
        name=LocationName(name),
        is_key=False,
        address_line=None,
        country=None,
        gps=GpsCoordinates(latitude=latitude, longitude=longitude),
    )
    return location.assign_ref_id(EntityId(ref_id))


def test_pick_duplicate_returns_closest_similar_name() -> None:
    closer = _location("Paris Office", 48.8566, 2.3522, "10")
    farther = _location("Paris Office", 48.8569, 2.3522, "11")
    picked = LocationCreateService()._pick_duplicate(
        [farther, closer],
        LocationName("Paris Office"),
        GpsCoordinates(latitude=48.8566, longitude=2.3522),
    )
    assert picked is not None
    assert picked.ref_id == closer.ref_id


def test_pick_duplicate_rejects_distant_same_name() -> None:
    distant = _location("Paris Office", 40.7128, -74.006, "10")
    picked = LocationCreateService()._pick_duplicate(
        [distant],
        LocationName("Paris Office"),
        GpsCoordinates(latitude=48.8566, longitude=2.3522),
    )
    assert picked is None


def test_pick_duplicate_rejects_nearby_different_name() -> None:
    nearby = _location("Berlin Office", 48.8566, 2.3522, "10")
    picked = LocationCreateService()._pick_duplicate(
        [nearby],
        LocationName("Paris Office"),
        GpsCoordinates(latitude=48.8566, longitude=2.3522),
    )
    assert picked is None


def test_pick_duplicate_accepts_small_name_typo() -> None:
    existing = _location("Paris Office", 48.8566, 2.3522, "10")
    picked = LocationCreateService()._pick_duplicate(
        [existing],
        LocationName("Paris Offic"),
        GpsCoordinates(latitude=48.8566, longitude=2.3522),
    )
    assert picked is not None
    assert picked.ref_id == existing.ref_id
