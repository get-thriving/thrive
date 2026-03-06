from enum import Enum


class TaskNamespace(str, Enum):
    BIG_PLAN = "big-plan"
    CHORE = "chore"
    HABIT = "habit"
    JOURNAL = "journal"
    METRIC = "metric"
    PERSON_CATCH_UP = "person-catch-up"
    PERSON_OCCASION = "person-occasion"
    TIME_PLAN = "time-plan"
    TODO = "todo"
    WORKING_MEM_CLEANUP = "working-mem-cleanup"

    def __str__(self) -> str:
        return str(self.value)
