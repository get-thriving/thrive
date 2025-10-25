"""Exception handling."""

import abc
from typing import Generic, TypeVar

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, PlainTextResponse
from jupiter.framework.global_properties import GlobalProperties

_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ExceptionT = TypeVar("_ExceptionT", bound=Exception)


class WebApiExceptionHandler(Generic[_GlobalPropertiesT, _ExceptionT], abc.ABC):
    """An exception handler for the web."""

    _global_properties: _GlobalPropertiesT
    _exception_type: type[_ExceptionT]

    def __init__(
        self, global_properties: _GlobalPropertiesT, exception_type: type[_ExceptionT]
    ) -> None:
        """Constructor."""
        self._global_properties = global_properties
        self._exception_type = exception_type

    @abc.abstractmethod
    def handle(self, exception: _ExceptionT) -> JSONResponse | PlainTextResponse:
        """Handle the exception."""

    def attach_handler(self, fast_api: FastAPI) -> None:
        """Attach the route to the app."""

        @fast_api.exception_handler(self._exception_type)
        async def handle_exception(
            request: Request, exc: _ExceptionT
        ) -> JSONResponse | PlainTextResponse:
            return self.handle(exc)
