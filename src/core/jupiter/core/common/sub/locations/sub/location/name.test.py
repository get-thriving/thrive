"""Tests for location name."""

from jupiter.core.common.sub.locations.sub.location.name import LocationName


def test_construction() -> None:
    location_name = LocationName("Home Office")
    assert str(location_name) == "Home Office"


def test_is_similar_to_ignores_case() -> None:
    assert LocationName("Paris Office").is_similar_to(LocationName("paris office"))
    assert not LocationName("Paris Office").is_similar_to(LocationName("Berlin Office"))


def test_is_similar_to_accepts_small_typo() -> None:
    assert LocationName("Paris Offic").is_similar_to(LocationName("Paris Office"))
