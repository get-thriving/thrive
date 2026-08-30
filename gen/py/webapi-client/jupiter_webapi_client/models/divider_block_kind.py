from enum import StrEnum


class DividerBlockKind(StrEnum):
    DIVIDER = "divider"

    def __str__(self) -> str:
        return str(self.value)
