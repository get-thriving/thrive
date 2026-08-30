from enum import StrEnum


class TableBlockKind(StrEnum):
    TABLE = "table"

    def __str__(self) -> str:
        return str(self.value)
