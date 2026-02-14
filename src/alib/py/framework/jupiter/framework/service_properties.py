"""Framework level service properties."""

import abc
from dataclasses import dataclass


@dataclass(frozen=True)
class ServiceProperties(abc.ABC):
    """The base class for service properties."""
