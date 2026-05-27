"""An application form."""

import abc
from typing import Generic, TypeVar

from jupiter.framework.component_properties import ComponentProperties
from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.ports import Ports
from jupiter.framework.service_properties import ServiceProperties

_PortsT = TypeVar("_PortsT", bound=Ports)
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)
_ComponentPropertiesT = TypeVar("_ComponentPropertiesT", bound=ComponentProperties)


class AppForm(
    abc.ABC,
    Generic[_PortsT, _GlobalPropertiesT, _ServicePropertiesT, _ComponentPropertiesT],
):
    """An application form."""

    _ports: _PortsT
    _global_properties: _GlobalPropertiesT
    _service_properties: _ServicePropertiesT

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
    ) -> None:
        """Constructor."""
        self._ports = ports
        self._global_properties = global_properties
        self._service_properties = service_properties

    @abc.abstractmethod
    async def run(self, argv: list[str]) -> None:
        """Run the application form with the given arguments."""
