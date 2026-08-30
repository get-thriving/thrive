"""Tests for location name."""

import pytest
from jupiter.core.common.sub.locations.sub.location.name import LocationName
from jupiter.framework.errors import InputValidationError


def test_construction() -> None:
    location_name = LocationName("Home Office")
    assert str(location_name) == "Home Office"


def test_construction_strips_and_collapses_whitespace() -> None:
    location_name = LocationName("  Home   Office  ")
    assert str(location_name) == "Home Office"


def test_construction_rejects_empty() -> None:
    with pytest.raises(InputValidationError):
        LocationName("   ")
