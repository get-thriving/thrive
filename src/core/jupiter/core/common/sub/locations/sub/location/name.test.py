"""Tests for location name."""

from jupiter.core.common.sub.locations.sub.location.name import LocationName


def test_construction() -> None:
    location_name = LocationName("Home Office")
    assert str(location_name) == "Home Office"
