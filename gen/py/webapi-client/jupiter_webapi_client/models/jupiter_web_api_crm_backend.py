from enum import Enum


class JupiterWebApiCrmBackend(str, Enum):
    NOOP = "noop"
    WIX = "wix"

    def __str__(self) -> str:
        return str(self.value)
