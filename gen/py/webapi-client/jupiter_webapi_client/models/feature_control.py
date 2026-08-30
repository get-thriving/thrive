from enum import StrEnum


class FeatureControl(StrEnum):
    ALWAYS_OFF_HOSTING = "always-off-hosting"
    ALWAYS_OFF_TECH = "always-off-tech"
    ALWAYS_ON = "always-on"
    USER = "user"

    def __str__(self) -> str:
        return str(self.value)
