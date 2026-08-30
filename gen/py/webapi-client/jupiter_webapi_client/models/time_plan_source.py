from enum import StrEnum


class TimePlanSource(StrEnum):
    GENERATED = "generated"
    USER = "user"

    def __str__(self) -> str:
        return str(self.value)
