"""Tests for how a cron reports the failures that used to disappear."""

from collections.abc import Iterator, Mapping
from contextlib import contextmanager
from dataclasses import dataclass

from jupiter.framework.appform.cron.exception import CronExceptionHandler
from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.service_properties import ServiceProperties
from jupiter.framework.telemetry.telemetry import Telemetry, TelemetryActor
from jupiter.framework.value import EnumValue


class NightlyJobError(Exception):
    """Something a background job could not do."""


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
        pass

    def record_expected_error(self, error: Exception, operation: str) -> None:
        self.expected.append((type(error).__name__, operation))

    def record_unexpected_error(self, error: Exception, operation: str) -> None:
        self.unexpected.append((type(error).__name__, operation))


class _NightlyJobHandler(
    CronExceptionHandler[GlobalProperties, ServiceProperties, NightlyJobError]
):
    """Handle a background job failure."""


def test_a_cron_failure_always_raises_an_issue():
    """There is no user to relay a cron failure to, so it has to page us.

    The web API can call a failure expected because a caller acts on it. A
    nightly job has no caller, so everything reaching a handler is a defect.
    """
    telemetry = _RecordingTelemetry()
    handler = _NightlyJobHandler(
        _FakeGlobalProperties(),
        _FakeServiceProperties(),
        NightlyJobError,
        telemetry,
    )

    handler.handle(NightlyJobError("the sync never finished"), "GCDoAllUseCase")

    assert telemetry.expected == []
    assert telemetry.unexpected == [("NightlyJobError", "GCDoAllUseCase")]


def test_the_reported_operation_names_the_job():
    """One worker runs one job, but an issue still has to say which."""
    telemetry = _RecordingTelemetry()
    handler = _NightlyJobHandler(
        _FakeGlobalProperties(),
        _FakeServiceProperties(),
        NightlyJobError,
        telemetry,
    )

    handler.handle(NightlyJobError("boom"), "SearchIndexBackfillDoAllUseCase")

    assert telemetry.unexpected[0][1] == "SearchIndexBackfillDoAllUseCase"
