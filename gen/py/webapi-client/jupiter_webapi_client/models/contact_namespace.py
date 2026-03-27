from enum import Enum


class ContactNamespace(str, Enum):
    BIG_PLAN = "big-plan"
    CHORE = "chore"
    HABIT = "habit"
    METRIC_ENTRY = "metric-entry"
    PERSON = "person"
    SCHEDULE_EVENT_FULL_DAYS_BLOCK = "schedule-event-full-days-block"
    SCHEDULE_EVENT_IN_DAY = "schedule-event-in-day"
    SMART_LIST_ITEM = "smart-list-item"
    TODO_TASK = "todo-task"
    VACATION = "vacation"

    def __str__(self) -> str:
        return str(self.value)
