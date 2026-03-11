from enum import Enum


class LifePlanEvalApproach(str, Enum):
    NONE = "none"
    TASK = "task"

    def __str__(self) -> str:
        return str(self.value)
