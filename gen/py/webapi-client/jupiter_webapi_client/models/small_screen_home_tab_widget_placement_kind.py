from enum import StrEnum


class SmallScreenHomeTabWidgetPlacementKind(StrEnum):
    SMALL_SCREEN = "small-screen"

    def __str__(self) -> str:
        return str(self.value)
