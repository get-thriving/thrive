from enum import StrEnum


class TimePlanActivityKind(StrEnum):
    FINISH = "finish"
    MAKE_PROGRESS = "make-progress"

    def __str__(self) -> str:
        return str(self.value)
