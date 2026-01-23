"""An abastract provider of telemetry services."""

from abc import ABC, abstractmethod


class Telemetry(ABC):
    """An abastract provider of telemetry services."""

    @abstractmethod
    def prepare(self) -> None:
        """Prepare the telemetry service."""
