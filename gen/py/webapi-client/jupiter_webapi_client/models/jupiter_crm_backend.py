from enum import Enum


class JupiterCrmBackend(str, Enum):
    NOOP = "noop"
    WIX = "wix"

    def __str__(self) -> str:
        return str(self.value)
