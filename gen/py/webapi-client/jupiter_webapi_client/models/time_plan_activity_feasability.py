from enum import StrEnum


class TimePlanActivityFeasability(StrEnum):
    MUST_DO = "must-do"
    NICE_TO_HAVE = "nice-to-have"
    STRETCH = "stretch"

    def __str__(self) -> str:
        return str(self.value)
