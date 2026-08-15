"""Tests for how the web API classifies and reports handled exceptions."""

from collections.abc import Iterator, Mapping
from contextlib import contextmanager
from dataclasses import dataclass

from fastapi import FastAPI
from fastapi.testclient import TestClient
from jupiter.framework.appform.webapi.exception import (
    WebApiError,
    WebApiExceptionHandler,
)
from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.service_properties import ServiceProperties
from jupiter.framework.telemetry.telemetry import (
    Telemetry,
    TelemetryActor,
)
from jupiter.framework.value import EnumValue


class TheUserGotItWrongError(Exception):
    """An outcome the caller can act on."""


class WeGotItWrongError(Exception):
    """A defect of ours."""


@dataclass(frozen=True)
class _FakeGlobalProperties(GlobalProperties):
    def allows(
        self, only_for: list[EnumValue] | None, excluded: list[EnumValue] | None
    ) -> bool:
        return True


@dataclass(frozen=True)
class _FakeServiceProperties(ServiceProperties):
    pass


class _RecordingTelemetry(Telemetry):
    """Records what it was asked to report, so a test can assert on it."""

    def __init__(self) -> None:
        self.expected: list[tuple[str, str]] = []
        self.unexpected: list[tuple[str, str]] = []
        self.operations: list[str] = []

    def prepare(self) -> None:
        pass

    @contextmanager
    def scope(self) -> Iterator[None]:
        yield

    def bind_actor(self, actor: TelemetryActor) -> None:
        pass

    def bind_operation(
        self, operation: str, tags: Mapping[str, str] | None = None
    ) -> None:
        self.operations.append(operation)

    def record_expected_error(self, error: Exception, operation: str) -> None:
        self.expected.append((type(error).__name__, operation))

    def record_unexpected_error(self, error: Exception, operation: str) -> None:
        self.unexpected.append((type(error).__name__, operation))


class _UserErrorHandler(
    WebApiExceptionHandler[GlobalProperties, ServiceProperties, TheUserGotItWrongError]
):
    @staticmethod
    def get_status_code() -> int:
        return 422

    def get_detail(self, exception: TheUserGotItWrongError) -> WebApiError:
        return WebApiError.simple("Bad input", str(exception))


class _OurErrorHandler(
    WebApiExceptionHandler[GlobalProperties, ServiceProperties, WeGotItWrongError]
):
    @staticmethod
    def get_status_code() -> int:
        return 503

    def get_detail(self, exception: WeGotItWrongError) -> WebApiError:
        return WebApiError.simple("Upstream is down", str(exception))


def _build_app(
    telemetry: Telemetry,
) -> FastAPI:
    app = FastAPI()
    global_properties = _FakeGlobalProperties()
    service_properties = _FakeServiceProperties()

    _UserErrorHandler(
        global_properties, service_properties, TheUserGotItWrongError, telemetry
    ).attach_handler(app)
    _OurErrorHandler(
        global_properties, service_properties, WeGotItWrongError, telemetry
    ).attach_handler(app)

    @app.get("/user-error")
    async def user_error() -> None:
        raise TheUserGotItWrongError("you typed it wrong")

    @app.get("/our-error")
    async def our_error() -> None:
        raise WeGotItWrongError("the database went away")

    return app


def test_a_4xx_handler_is_expected_and_a_5xx_one_is_not():
    """The split follows the status code, so nobody has to maintain a list."""
    telemetry = _RecordingTelemetry()
    global_properties = _FakeGlobalProperties()
    service_properties = _FakeServiceProperties()

    user_handler = _UserErrorHandler(
        global_properties, service_properties, TheUserGotItWrongError, telemetry
    )
    our_handler = _OurErrorHandler(
        global_properties, service_properties, WeGotItWrongError, telemetry
    )

    assert user_handler.is_expected
    assert not our_handler.is_expected


def test_a_handled_4xx_never_raises_an_issue():
    """Validation failures are the app working, and must not page anyone."""
    telemetry = _RecordingTelemetry()
    client = TestClient(_build_app(telemetry), raise_server_exceptions=False)

    response = client.get("/user-error")

    assert response.status_code == 422
    assert response.json()["reason"] == "Bad input"
    assert telemetry.unexpected == []
    assert telemetry.expected == [("TheUserGotItWrongError", "GET /user-error")]


def test_a_handled_5xx_does_raise_an_issue():
    """A handler existing does not make the failure harmless."""
    telemetry = _RecordingTelemetry()
    client = TestClient(_build_app(telemetry), raise_server_exceptions=False)

    response = client.get("/our-error")

    assert response.status_code == 503
    assert telemetry.expected == []
    assert telemetry.unexpected == [("WeGotItWrongError", "GET /our-error")]


def test_the_reported_operation_names_the_route_that_failed():
    """An issue is useless if it cannot say which endpoint produced it."""
    telemetry = _RecordingTelemetry()
    client = TestClient(_build_app(telemetry), raise_server_exceptions=False)

    client.get("/our-error")

    assert telemetry.unexpected[0][1] == "GET /our-error"
