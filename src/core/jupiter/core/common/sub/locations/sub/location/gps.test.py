"""Tests for GPS coordinates."""

import pytest
from jupiter.core.common.sub.locations.sub.location.gps import (
    LOCATION_DEDUP_RADIUS_METERS,
    METERS_PER_DEGREE_LAT,
    GpsCoordinates,
)
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


def test_distance_meters_zero_for_same_point() -> None:
    gps = GpsCoordinates(latitude=48.8566, longitude=2.3522)
    assert gps.distance_meters(gps) == pytest.approx(0.0)


def test_distance_meters_about_fifty_at_equator() -> None:
    origin = GpsCoordinates(latitude=0.0, longitude=0.0)
    nearby = GpsCoordinates(
        latitude=0.0, longitude=LOCATION_DEDUP_RADIUS_METERS / METERS_PER_DEGREE_LAT
    )
    assert nearby.distance_meters(origin) == pytest.approx(
        LOCATION_DEDUP_RADIUS_METERS, rel=0.01
    )


def test_bounding_box_is_square_in_meters() -> None:
    origin = GpsCoordinates(latitude=0.0, longitude=0.0)
    lat_min, lat_max, lng_min, lng_max = origin.bounding_box(50.0)
    assert lat_max - lat_min == pytest.approx(2 * 50.0 / METERS_PER_DEGREE_LAT)
    assert lng_max - lng_min == pytest.approx(2 * 50.0 / METERS_PER_DEGREE_LAT)


def test_bounding_box_lng_widens_away_from_equator() -> None:
    equator = GpsCoordinates(latitude=0.0, longitude=10.0)
    north = GpsCoordinates(latitude=60.0, longitude=10.0)
    _, _, eq_lng_min, eq_lng_max = equator.bounding_box(50.0)
    _, _, north_lng_min, north_lng_max = north.bounding_box(50.0)
    assert (north_lng_max - north_lng_min) > (eq_lng_max - eq_lng_min)
