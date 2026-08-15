"""Sentry telemetry provider."""

import logging
from collections.abc import Iterator, Mapping
from contextlib import contextmanager
from typing import Final, cast

import sentry_sdk
from jupiter.framework.telemetry.current import set_current_telemetry
from jupiter.framework.telemetry.scrub import scrub_event, scrub_value
from jupiter.framework.telemetry.telemetry import (
    Telemetry,
    TelemetryActor,
    TelemetryDeployment,
)
from sentry_sdk.integrations.logging import LoggingIntegration
from sentry_sdk.types import Event, Hint, Log, SamplingContext

LOGGER = logging.getLogger(__name__)

# Render polls these constantly and they carry no signal, so they are worth
# neither a transaction nor the quota one costs.
_UNSAMPLED_ROUTES: Final[frozenset[str]] = frozenset(
    ["/healthz", "/openapi.json", "/docs", "/redoc"]
)

_LOG_FORMAT: Final[str] = "%(asctime)s %(levelname)-8s %(name)s: %(message)s"


class SentryTelemetry(Telemetry):
    """Sentry telemetry provider."""

    _dsn: Final[str]
    _deployment: Final[TelemetryDeployment]
    _traces_sample_rate: Final[float]

    def __init__(
        self,
        dsn: str,
        deployment: TelemetryDeployment,
        traces_sample_rate: float = 0.1,
    ) -> None:
        """Constructor."""
        self._dsn = dsn
        self._deployment = deployment
        self._traces_sample_rate = traces_sample_rate

    def prepare(self) -> None:
        """Prepare the telemetry service."""
        # Sentry is an additional sink, not a replacement for stdout. Without
        # this the root logger stays at WARNING and every INFO in the codebase
        # - including the use case invocation audit line - is dropped, in the
        # one environment where it matters most.
        logging.basicConfig(
            level=logging.INFO,
            format=_LOG_FORMAT,
            datefmt="%Y-%m-%d %H:%M:%S",
        )

        sentry_sdk.init(
            dsn=self._dsn,
            environment=self._deployment.environment,
            release=self._deployment.release,
            server_name=self._deployment.server_name,
            # Identity is attached deliberately, as ids, by `bind_actor`. The
            # default would add IP addresses, headers and request bodies.
            send_default_pii=False,
            enable_logs=True,
            attach_stacktrace=False,
            max_breadcrumbs=50,
            integrations=[
                LoggingIntegration(
                    level=logging.INFO,
                    event_level=logging.ERROR,
                ),
            ],
            traces_sampler=self._sample_trace,
            before_send=self._before_send,
            before_send_transaction=self._before_send,
            before_send_log=self._before_send_log,
        )

        sentry_sdk.set_tags(dict(self._deployment.as_tags()))

        set_current_telemetry(self)

    @contextmanager
    def scope(self) -> Iterator[None]:
        """Isolate what is bound inside it to one request, job run, or tool call."""
        with sentry_sdk.isolation_scope():
            yield

    def bind_actor(self, actor: TelemetryActor) -> None:
        """Attach who the current operation is running on behalf of."""
        # The context string is what `mutation_invocation_record` persists, so
        # an issue here and a row there join on the same value.
        sentry_sdk.set_user({"id": actor.context_str})

    def bind_operation(
        self, operation: str, tags: Mapping[str, str] | None = None
    ) -> None:
        """Attach what the current operation is, and what locates it."""
        sentry_sdk.set_tag("operation", operation)
        for key, value in (tags or {}).items():
            sentry_sdk.set_tag(key, value)

    def record_expected_error(self, error: Exception, operation: str) -> None:
        """Record an outcome the caller can act on - never an issue."""
        LOGGER.info(
            "Expected error in %s: %s: %s",
            operation,
            type(error).__name__,
            error,
        )
        sentry_sdk.add_breadcrumb(
            category="expected-error",
            level="info",
            message=f"{type(error).__name__} in {operation}",
            data={"error": str(error)},
        )

    def record_unexpected_error(self, error: Exception, operation: str) -> None:
        """Record a defect or an infrastructure failure - always an issue."""
        LOGGER.error(
            "Unexpected error in %s: %s",
            operation,
            error,
            exc_info=error,
        )
        # LOGGER.error already produces an event through LoggingIntegration, but
        # that one carries the logging call site rather than the exception's own
        # stack. Capturing explicitly gets the real frames; Sentry groups the two
        # together on the same fingerprint.
        sentry_sdk.capture_exception(error)

    def _sample_trace(self, sampling_context: SamplingContext) -> float:
        """Trace at the configured rate, except for routes that carry no signal."""
        asgi_scope = sampling_context.get("asgi_scope") or {}
        path = asgi_scope.get("path") if isinstance(asgi_scope, dict) else None
        if isinstance(path, str) and path.rstrip("/") in _UNSAMPLED_ROUTES:
            return 0.0
        return self._traces_sample_rate

    @staticmethod
    def _before_send(event: Event, hint: Hint) -> Event | None:
        """Strip anything secret that reached the event without us choosing it."""
        return cast(Event, scrub_event(cast(dict[str, object], event)))

    @staticmethod
    def _before_send_log(log: Log, hint: Hint) -> Log | None:
        """Strip secret-looking attributes from a structured log."""
        raw_log = cast(dict[str, object], log)
        if "attributes" in raw_log:
            raw_log["attributes"] = scrub_value(raw_log["attributes"])
        return cast(Log, raw_log)
