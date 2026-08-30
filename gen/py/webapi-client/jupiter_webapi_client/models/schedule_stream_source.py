from enum import StrEnum


class ScheduleStreamSource(StrEnum):
    EXTERNAL_ICAL = "external-ical"
    USER = "user"

    def __str__(self) -> str:
        return str(self.value)
