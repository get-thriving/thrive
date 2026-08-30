from enum import StrEnum


class TimePlanActivityDoneness(StrEnum):
    DONE = "done"
    NOT_DONE = "not-done"
    WORKING = "working"

    def __str__(self) -> str:
        return str(self.value)
