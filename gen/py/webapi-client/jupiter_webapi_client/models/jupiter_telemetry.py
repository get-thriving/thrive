from enum import StrEnum


class JupiterTelemetry(StrEnum):
    LOCAL = "local"
    SENTRY = "sentry"

    def __str__(self) -> str:
        return str(self.value)
