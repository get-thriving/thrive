from enum import StrEnum


class ColorScheme(StrEnum):
    DARK = "dark"
    LIGHT = "light"
    SYSTEM = "system"

    def __str__(self) -> str:
        return str(self.value)
