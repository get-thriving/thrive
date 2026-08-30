"""GPS coordinates for a location."""

from jupiter.framework.errors import InputValidationError
from jupiter.framework.value import CompositeValue, value


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

    def __str__(self) -> str:
        """Transform this to a string version."""
        return f"{self.latitude}, {self.longitude}"
