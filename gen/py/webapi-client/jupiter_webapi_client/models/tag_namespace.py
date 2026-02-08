from enum import Enum


class TagNamespace(str, Enum):
    BIG_PLAN = "big-plan"
    CHORE = "chore"
    DOC = "doc"
    HABIT = "habit"
    INBOX_TASK = "inbox-task"
    JOURNAL = "journal"
    METRIC = "metric"
    METRIC_ENTRY = "metric-entry"
    PERSON = "person"
    SCHEDULE_EVENT_FULL_DAYS_BLOCK = "schedule-event-full-days-block"
    SCHEDULE_EVENT_IN_DAY = "schedule-event-in-day"
    SMART_LIST = "smart-list"
    SMART_LIST_ITEM = "smart-list-item"
    VACATION = "vacation"

    def __str__(self) -> str:
        return str(self.value)
