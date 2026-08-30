from enum import StrEnum


class LifePlanEvalApproach(StrEnum):
    NONE = "none"
    TASK = "task"

    def __str__(self) -> str:
        return str(self.value)
