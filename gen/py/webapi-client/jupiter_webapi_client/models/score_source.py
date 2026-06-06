from enum import Enum


class ScoreSource(str, Enum):
    PROJECT = "project"
    INBOX_TASK = "inbox-task"

    def __str__(self) -> str:
        return str(self.value)
