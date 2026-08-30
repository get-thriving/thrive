from enum import StrEnum


class UserFeature(StrEnum):
    GAMIFICATION = "gamification"

    def __str__(self) -> str:
        return str(self.value)
