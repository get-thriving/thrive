"""Local telemetry provider."""

import logging
from collections.abc import Iterator, Mapping
from contextlib import contextmanager
from typing import Final

from jupiter.framework.telemetry.current import set_current_telemetry
from jupiter.framework.telemetry.telemetry import (
    Telemetry,
    TelemetryActor,
    TelemetryDeployment,
)
from rich.console import Console
from rich.logging import RichHandler

LOGGER = logging.getLogger(__name__)


class LocalTelemetry(Telemetry):
    """Local telemetry provider.

    Reports to the terminal instead of to Sentry, but classifies errors exactly
    the same way, so what a developer sees matches what production would page on.
    """

    _deployment: Final[TelemetryDeployment | None]

    def __init__(self, deployment: TelemetryDeployment | None = None) -> None:
        """Constructor."""
        self._deployment = deployment

    def prepare(self) -> None:
        """Prepare the telemetry service."""
        logging.basicConfig(
            level=logging.INFO,
            format="%(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
            handlers=[
                RichHandler(
                    console=Console(width=128),
                    show_path=False,
                    omit_repeated_times=False,
                    rich_tracebacks=True,
                    markup=True,
                    enable_link_path=False,
                    log_time_format="%Y-%m-%d %H:%M:%S",
                )
            ],
        )

        set_current_telemetry(self)

    @contextmanager
    def scope(self) -> Iterator[None]:
        """Isolate what is bound inside it to one request, job run, or tool call."""
        yield

    def bind_actor(self, actor: TelemetryActor) -> None:
        """Attach who the current operation is running on behalf of."""

    def bind_operation(
        self, operation: str, tags: Mapping[str, str] | None = None
    ) -> None:
        """Attach what the current operation is, and what locates it."""

    def record_expected_error(self, error: Exception, operation: str) -> None:
        """Record an outcome the caller can act on - never an issue."""
        LOGGER.info(
            "Expected error in %s: %s: %s",
            operation,
            type(error).__name__,
            error,
        )

    def record_unexpected_error(self, error: Exception, operation: str) -> None:
        """Record a defect or an infrastructure failure - always an issue."""
        LOGGER.error(
            "Unexpected error in %s: %s",
            operation,
            error,
            exc_info=error,
        )
