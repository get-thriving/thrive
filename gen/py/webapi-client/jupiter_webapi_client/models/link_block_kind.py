from enum import StrEnum


class LinkBlockKind(StrEnum):
    LINK = "link"

    def __str__(self) -> str:
        return str(self.value)
