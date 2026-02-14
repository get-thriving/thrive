"""A service at the framework level."""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar

from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.service_properties import ServiceProperties

_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)


class Service(ABC, Generic[_GlobalPropertiesT, _ServicePropertiesT]):
    """A service at the framework level."""

    _global_properties: _GlobalPropertiesT
    _service_properties: _ServicePropertiesT

    def __init__(
        self,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
    ) -> None:
        """Initialize the service."""
        self._global_properties = global_properties
        self._service_properties = service_properties

    @abstractmethod
    async def run(self) -> None:
        """Run the service."""
