"""A service at the framework level."""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar

from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.ports import Ports
from jupiter.framework.service_properties import ServiceProperties

_PortsT = TypeVar("_PortsT", bound=Ports)
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)


class Service(ABC, Generic[_PortsT, _GlobalPropertiesT, _ServicePropertiesT]):
    """A service at the framework level."""

    _ports: _PortsT
    _global_properties: _GlobalPropertiesT
    _service_properties: _ServicePropertiesT

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
    ) -> None:
        """Initialize the service."""
        self._ports = ports
        self._global_properties = global_properties
        self._service_properties = service_properties

    @abstractmethod
    async def run(self) -> None:
        """Run the service."""
