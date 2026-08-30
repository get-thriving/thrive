from enum import StrEnum


class ScoreSource(StrEnum):
    BIG_PLAN = "big-plan"
    INBOX_TASK = "inbox-task"

    def __str__(self) -> str:
        return str(self.value)
