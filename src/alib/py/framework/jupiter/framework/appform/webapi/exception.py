"""Exception handling."""

import abc
from typing import Generic, Sequence, TypeVar

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from jupiter.framework.global_properties import GlobalProperties

_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ExceptionT = TypeVar("_ExceptionT", bound=Exception)


ExceptionDetailT = dict[
    str,
    str
    | list[str]
    | dict[str, str | list[str]]
    | list[dict[str, str | list[str]]]
    | list[dict[str, Sequence[str]]],
]


class WebApiExceptionHandler(abc.ABC, Generic[_GlobalPropertiesT, _ExceptionT]):
    """An exception handler for the web."""

    _global_properties: _GlobalPropertiesT
    _exception_type: type[_ExceptionT]

    def __init__(
        self, global_properties: _GlobalPropertiesT, exception_type: type[_ExceptionT]
    ) -> None:
        """Constructor."""
        self._global_properties = global_properties
        self._exception_type = exception_type

    @staticmethod
    @abc.abstractmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""

    @abc.abstractmethod
    def get_detail(self, exception: _ExceptionT) -> ExceptionDetailT:
        """Get the detail for the exception."""

    def attach_handler(self, fast_api: FastAPI) -> None:
        """Attach the route to the app."""

        @fast_api.exception_handler(self._exception_type)
        async def handle_exception(request: Request, exc: _ExceptionT) -> JSONResponse:
            return JSONResponse(
                status_code=self.get_status_code(),
                content=self.get_detail(exc),
            )
