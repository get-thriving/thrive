from enum import StrEnum


class JupiterLocationResolver(StrEnum):
    GOOGLE_MAPS = "google-maps"
    NOOP = "noop"

    def __str__(self) -> str:
        return str(self.value)
