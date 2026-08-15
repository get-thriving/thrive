"""Exception handling for cron application forms."""

import abc
from typing import Generic, TypeVar

from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.service_properties import ServiceProperties
from jupiter.framework.telemetry.telemetry import Telemetry

_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)
_ExceptionT = TypeVar("_ExceptionT", bound=Exception)


class CronExceptionHandler(
    abc.ABC, Generic[_GlobalPropertiesT, _ServicePropertiesT, _ExceptionT]
):
    """Base class for cron exception handlers.

    A cron has no user to relay a failure to, so unlike the web API there is no
    expected/unexpected split here: everything that reaches a handler is a
    defect or an infrastructure failure, and is reported as one (see ADR 0012).
    """

    _global_properties: _GlobalPropertiesT
    _service_properties: _ServicePropertiesT
    _exception_type: type[_ExceptionT]
    _telemetry: Telemetry

    def __init__(
        self,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
        exception_type: type[_ExceptionT],
        telemetry: Telemetry,
    ) -> None:
        """Constructor."""
        self._global_properties = global_properties
        self._service_properties = service_properties
        self._exception_type = exception_type
        self._telemetry = telemetry

    def handle(self, exception: _ExceptionT, operation: str) -> None:
        """Report the exception as a failure of this cron run."""
        self._telemetry.record_unexpected_error(exception, operation)
