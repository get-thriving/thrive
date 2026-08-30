from enum import StrEnum


class HeadingBlockKind(StrEnum):
    HEADING = "heading"

    def __str__(self) -> str:
        return str(self.value)
