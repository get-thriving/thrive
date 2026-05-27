"""Exception handling."""

import abc
from typing import Generic, TypeVar

from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.service_properties import ServiceProperties
from rich.console import Console

_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)
_ExceptionT = TypeVar("_ExceptionT", bound=Exception)


class CliExceptionHandler(
    abc.ABC, Generic[_GlobalPropertiesT, _ServicePropertiesT, _ExceptionT]
):
    """Base class for exception handlers."""

    _global_properties: _GlobalPropertiesT
    _service_properties: _ServicePropertiesT

    def __init__(
        self,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
    ) -> None:
        """Constructor."""
        self._global_properties = global_properties
        self._service_properties = service_properties

    @abc.abstractmethod
    def handle(self, console: Console, exception: _ExceptionT) -> None:
        """Handle an exception."""
