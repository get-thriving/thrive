"""Sentry telemetry provider."""

from typing import Final

import sentry_sdk
from jupiter.framework.telemetry.telemetry import Telemetry


class SentryTelemetry(Telemetry):
    """Sentry telemetry provider."""

    _dsn: Final[str]

    def __init__(self, dsn: str) -> None:
        """Constructor."""
        self._dsn = dsn

    def prepare(self) -> None:
        """Prepare the telemetry service."""
        sentry_sdk.init(
            dsn=self._dsn,
            send_default_pii=True,
            enable_logs=True,
        )
