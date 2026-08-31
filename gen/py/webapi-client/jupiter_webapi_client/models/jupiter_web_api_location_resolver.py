from enum import StrEnum


class JupiterWebApiLocationResolver(StrEnum):
    GOOGLE_MAPS = "google-maps"
    NOOP = "noop"

    def __str__(self) -> str:
        return str(self.value)
