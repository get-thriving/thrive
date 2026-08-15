"""Exception handling."""

import abc
from dataclasses import dataclass
from typing import Any, Generic, Sequence, TypeVar

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.service_properties import ServiceProperties
from jupiter.framework.telemetry.telemetry import Telemetry

_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)
_ExceptionT = TypeVar("_ExceptionT", bound=Exception)


@dataclass(frozen=True)
class WebApiErrorDetailItem:
    """A single structured validation-style error entry."""

    loc: Sequence[str]
    msg: str
    type: str


@dataclass(frozen=True)
class WebApiError:
    """The error payload returned by exception handlers."""

    reason: str
    detail: str | list[WebApiErrorDetailItem]

    @staticmethod
    def simple(reason: str, detail: str) -> "WebApiError":
        """Build an error with a plain string detail."""
        return WebApiError(reason=reason, detail=detail)

    @staticmethod
    def validation(
        reason: str,
        *,
        loc: Sequence[str],
        msg: str,
        error_type: str,
    ) -> "WebApiError":
        """Build an error with a single validation item."""
        return WebApiError(
            reason=reason,
            detail=[WebApiErrorDetailItem(loc=loc, msg=msg, type=error_type)],
        )

    @staticmethod
    def validations(
        reason: str,
        items: list[WebApiErrorDetailItem],
    ) -> "WebApiError":
        """Build an error with multiple validation items."""
        return WebApiError(reason=reason, detail=items)

    def to_dict(self) -> dict[str, Any]:  # type: ignore[explicit-any]
        """Serialize to the JSON-compatible dict expected by FastAPI."""
        if isinstance(self.detail, str):
            return {"reason": self.reason, "detail": self.detail}
        return {
            "reason": self.reason,
            "detail": [
                {"loc": list(item.loc), "msg": item.msg, "type": item.type}
                for item in self.detail
            ],
        }


class WebApiExceptionHandler(
    abc.ABC, Generic[_GlobalPropertiesT, _ServicePropertiesT, _ExceptionT]
):
    """An exception handler for the web."""

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

    @staticmethod
    @abc.abstractmethod
    def get_status_code() -> int:
        """Get the status code for the exception."""

    @abc.abstractmethod
    def get_detail(self, exception: _ExceptionT) -> WebApiError:
        """Get the detail for the exception."""

    @property
    def is_expected(self) -> bool:
        """Whether this is an outcome the caller can act on, rather than a defect.

        A handler exists because the failure has a meaning worth relaying, and
        the status code already says whose fault it is. Deriving the split from
        that keeps alerting honest: a 4xx never raises an issue, and a handler
        that starts returning 5xx starts reporting without anyone remembering to
        say so (see ADR 0012).
        """
        return self.get_status_code() < 500

    def on_exception(self, exc: _ExceptionT) -> None:
        """Called when an exception is handled; override to log etc."""

    def attach_handler(self, fast_api: FastAPI) -> None:
        """Attach the route to the app."""

        @fast_api.exception_handler(self._exception_type)
        async def handle_exception(request: Request, exc: _ExceptionT) -> JSONResponse:
            self.on_exception(exc)

            # Sentry's Starlette integration only auto-captures handled
            # exceptions that carry a `status_code` attribute. Ours do not, so
            # without this every handled failure - harmless or not - would be
            # invisible.
            operation = f"{request.method} {request.url.path}"
            if self.is_expected:
                self._telemetry.record_expected_error(exc, operation)
            else:
                self._telemetry.record_unexpected_error(exc, operation)

            return JSONResponse(
                status_code=self.get_status_code(),
                content=self.get_detail(exc).to_dict(),
            )
