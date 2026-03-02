from enum import Enum


class ContactNamespace(str, Enum):
    BIG_PLAN = "big-plan"
    CHAPTER = "chapter"
    CHORE = "chore"
    DOC = "doc"
    GOAL = "goal"
    HABIT = "habit"
    INBOX_TASK = "inbox-task"
    JOURNAL = "journal"
    METRIC = "metric"
    METRIC_ENTRY = "metric-entry"
    MILESTONE = "milestone"
    OCCASION = "occasion"
    PERSON = "person"
    PROJECT = "project"
    SCHEDULE_EVENT_FULL_DAYS_BLOCK = "schedule-event-full-days-block"
    SCHEDULE_EVENT_IN_DAY = "schedule-event-in-day"
    SCHEDULE_STREAM = "schedule-stream"
    SMART_LIST = "smart-list"
    SMART_LIST_ITEM = "smart-list-item"
    TIME_PLAN = "time-plan"
    VACATION = "vacation"

    def __str__(self) -> str:
        return str(self.value)
