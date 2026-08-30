from enum import StrEnum


class JupiterCrmBackend(StrEnum):
    NOOP = "noop"
    WIX = "wix"

    def __str__(self) -> str:
        return str(self.value)
