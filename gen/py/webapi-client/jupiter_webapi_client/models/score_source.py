from enum import Enum


class ScoreSource(str, Enum):
    INBOX_TASK = "inbox-task"
    PROJECT = "project"

    def __str__(self) -> str:
        return str(self.value)
