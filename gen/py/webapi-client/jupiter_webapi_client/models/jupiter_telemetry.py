from enum import Enum


class JupiterTelemetry(str, Enum):
    LOCAL = "local"
    SENTRY = "sentry"

    def __str__(self) -> str:
        return str(self.value)
