from enum import StrEnum


class BigScreenHomeTabWidgetPlacementKind(StrEnum):
    BIG_SCREEN = "big-screen"

    def __str__(self) -> str:
        return str(self.value)
