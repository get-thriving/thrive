from enum import Enum


class OccasionKind(str, Enum):
    ANNIVERSARY = "anniversary"
    BIRTHDAY = "birthday"
    HOLIDAY = "holiday"
    OTHER = "other"

    def __str__(self) -> str:
        return str(self.value)
