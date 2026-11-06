from enum import StrEnum


class EmptyHomeWidgetPropertiesKind(StrEnum):
    EMPTY = "empty"

    def __str__(self) -> str:
        return str(self.value)
