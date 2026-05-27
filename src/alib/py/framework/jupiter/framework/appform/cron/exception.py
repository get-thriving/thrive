"""Exception handling for cron application forms."""

import abc
import logging
from typing import Generic, TypeVar

from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.service_properties import ServiceProperties

LOGGER = logging.getLogger(__name__)

_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)
_ExceptionT = TypeVar("_ExceptionT", bound=Exception)


class CronExceptionHandler(
    abc.ABC, Generic[_GlobalPropertiesT, _ServicePropertiesT, _ExceptionT]
):
    """Base class for cron exception handlers."""

    _global_properties: _GlobalPropertiesT
    _service_properties: _ServicePropertiesT
    _exception_type: type[_ExceptionT]

    def __init__(
        self,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
        exception_type: type[_ExceptionT],
    ) -> None:
        """Constructor."""
        self._global_properties = global_properties
        self._service_properties = service_properties
        self._exception_type = exception_type

    def handle(self, exception: _ExceptionT) -> None:
        """Log the exception."""
        LOGGER.error(
            "Cron exception %s: %s",
            self._exception_type.__name__,
            exception,
            exc_info=exception,
        )
