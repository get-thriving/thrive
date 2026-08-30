from enum import StrEnum


class OccasionKind(StrEnum):
    ANNIVERSARY = "anniversary"
    BIRTHDAY = "birthday"
    HOLIDAY = "holiday"
    OTHER = "other"

    def __str__(self) -> str:
        return str(self.value)
