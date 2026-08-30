from enum import StrEnum


class NumberedListBlockKind(StrEnum):
    NUMBERED_LIST = "numbered-list"

    def __str__(self) -> str:
        return str(self.value)
