"""Exception handling."""

import abc
from typing import Generic, TypeVar

from jupiter.framework.global_properties import GlobalProperties
from rich.console import Console

_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ExceptionT = TypeVar("_ExceptionT", bound=Exception)


class CliExceptionHandler(abc.ABC, Generic[_GlobalPropertiesT, _ExceptionT]):
    """Base class for exception handlers."""

    _global_properties: _GlobalPropertiesT

    def __init__(self, global_properties: _GlobalPropertiesT) -> None:
        """Constructor."""
        self._global_properties = global_properties

    @abc.abstractmethod
    def handle(self, console: Console, exception: _ExceptionT) -> None:
        """Handle an exception."""
