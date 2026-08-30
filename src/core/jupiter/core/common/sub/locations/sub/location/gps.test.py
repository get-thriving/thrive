"""Tests for GPS coordinates."""

import pytest
from jupiter.core.common.sub.locations.sub.location.gps import GpsCoordinates
from jupiter.framework.errors import InputValidationError


def test_construction() -> None:
    gps = GpsCoordinates(latitude=40.7128, longitude=-74.006)
    assert gps.latitude == 40.7128
    assert gps.longitude == -74.006
    assert str(gps) == "40.7128, -74.006"


def test_construction_rejects_out_of_range() -> None:
    with pytest.raises(InputValidationError):
        GpsCoordinates(latitude=91.0, longitude=0.0)
    with pytest.raises(InputValidationError):
        GpsCoordinates(latitude=0.0, longitude=181.0)
