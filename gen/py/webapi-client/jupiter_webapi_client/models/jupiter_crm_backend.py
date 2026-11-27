from enum import StrEnum


class JupiterCrmBackend(StrEnum):
    NOOP = "noop"
    RESEND = "resend"

    def __str__(self) -> str:
        return str(self.value)
