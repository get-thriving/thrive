from enum import StrEnum


class HomeTabTarget(StrEnum):
    BIG_SCREEN = "big-screen"
    SMALL_SCREEN = "small-screen"

    def __str__(self) -> str:
        return str(self.value)
