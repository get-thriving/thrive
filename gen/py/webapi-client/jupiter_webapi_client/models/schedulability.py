from enum import StrEnum


class Schedulability(StrEnum):
    NOT_SCHEDULABLE = "not-schedulable"
    SCHEDULABLE = "schedulable"

    def __str__(self) -> str:
        return str(self.value)
