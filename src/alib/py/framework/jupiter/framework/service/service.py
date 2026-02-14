"""A service at the framework level."""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar

from jupiter.framework.service_properties import ServiceProperties

_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)


class Service(ABC, Generic[_ServicePropertiesT]):
    """A service at the framework level."""

    _properties: _ServicePropertiesT

    def __init__(self, properties: _ServicePropertiesT) -> None:
        """Initialize the service."""
        self._properties = properties

    @abstractmethod
    async def run(self) -> None:
        """Run the service."""
