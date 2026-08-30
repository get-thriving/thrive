from enum import StrEnum


class TimePlanGenerationApproach(StrEnum):
    BOTH_PLAN_AND_TASK = "both-plan-and-task"
    NONE = "none"
    ONLY_PLAN = "only-plan"

    def __str__(self) -> str:
        return str(self.value)
