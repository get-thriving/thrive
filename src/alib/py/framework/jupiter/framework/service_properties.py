"""Framework level service properties."""

from dataclasses import dataclass


class UnavailableForServiceError(Exception):
    """Exception raise when an action is blocked in a service."""


@dataclass(frozen=True)
class ServiceProperties:
    """The base class for service properties."""
