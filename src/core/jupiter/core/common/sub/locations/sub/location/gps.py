"""GPS coordinates for a location."""

import math

from jupiter.framework.errors import InputValidationError
from jupiter.framework.value import CompositeValue, value

METERS_PER_DEGREE_LAT = 111_320.0
EARTH_RADIUS_METERS = 6_371_000.0
LOCATION_DEDUP_RADIUS_METERS = 50.0


@value
class GpsCoordinates(CompositeValue):
    """A latitude/longitude pair."""

    latitude: float
    longitude: float

    def _validate(self) -> None:
        """Validate this value."""
        if self.latitude < -90.0 or self.latitude > 90.0:
            raise InputValidationError(
                f"Expected latitude to be between -90 and 90 but was {self.latitude}",
            )
        if self.longitude < -180.0 or self.longitude > 180.0:
            raise InputValidationError(
                f"Expected longitude to be between -180 and 180 but was {self.longitude}",
            )

    def distance_meters(self, other: "GpsCoordinates") -> float:
        """Haversine distance to ``other`` in meters."""
        phi1 = math.radians(self.latitude)
        phi2 = math.radians(other.latitude)
        dphi = math.radians(other.latitude - self.latitude)
        dlambda = math.radians(other.longitude - self.longitude)
        a = (
            math.sin(dphi / 2) ** 2
            + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
        )
        return 2 * EARTH_RADIUS_METERS * math.asin(min(1.0, math.sqrt(a)))

    def bounding_box(
        self, radius_meters: float = LOCATION_DEDUP_RADIUS_METERS
    ) -> tuple[float, float, float, float]:
        """Axis-aligned lat/lng box around this point, about ``radius_meters`` on each side.

        Returns ``(lat_min, lat_max, lng_min, lng_max)``. Longitude is skipped
        near the poles where ``cos(lat)`` vanishes; the antimeridian is clamped
        rather than wrapped.
        """
        dlat = radius_meters / METERS_PER_DEGREE_LAT
        lat_min = max(-90.0, self.latitude - dlat)
        lat_max = min(90.0, self.latitude + dlat)

        cos_lat = math.cos(math.radians(self.latitude))
        if abs(cos_lat) < 1e-6:
            return lat_min, lat_max, -180.0, 180.0

        dlng = radius_meters / (METERS_PER_DEGREE_LAT * abs(cos_lat))
        lng_min = max(-180.0, self.longitude - dlng)
        lng_max = min(180.0, self.longitude + dlng)
        return lat_min, lat_max, lng_min, lng_max

    def __str__(self) -> str:
        """Transform this to a string version."""
        return f"{self.latitude}, {self.longitude}"
