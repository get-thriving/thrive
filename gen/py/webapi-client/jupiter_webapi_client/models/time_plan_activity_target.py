from enum import Enum


class TimePlanActivityTarget(str, Enum):
    CHORE = "chore"
    HABIT = "habit"
    INBOX_TASK = "inbox-task"
    PROJECT = "project"
    TODO_TASK = "todo-task"

    def __str__(self) -> str:
        return str(self.value)
