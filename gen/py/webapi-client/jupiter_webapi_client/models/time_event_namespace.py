from enum import Enum


class TimeEventNamespace(str, Enum):
    BIG_PLAN = "big-plan"
    CHORE = "chore"
    HABIT = "habit"
    INBOX_TASK = "inbox-task"
    PERSON_OCCASION = "person-occasion"
    SCHEDULE_EVENT_IN_DAY = "schedule-event-in-day"
    SCHEDULE_FULL_DAYS_BLOCK = "schedule-full-days-block"
    TODO_TASK = "todo-task"
    VACATION = "vacation"

    def __str__(self) -> str:
        return str(self.value)
