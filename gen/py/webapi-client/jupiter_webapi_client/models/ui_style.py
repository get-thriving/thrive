from enum import StrEnum


class UiStyle(StrEnum):
    CLASSIC = "classic"
    STRATA = "strata"

    def __str__(self) -> str:
        return str(self.value)
