from enum import Enum


class TagNamespace(str, Enum):
    ASPECT = "aspect"
    BIG_PLAN = "big-plan"
    CHAPTER = "chapter"
    CHORE = "chore"
    DOC = "doc"
    GOAL = "goal"
    HABIT = "habit"
    JOURNAL = "journal"
    METRIC = "metric"
    METRIC_ENTRY = "metric-entry"
    MILESTONE = "milestone"
    OCCASION = "occasion"
    PERSON = "person"
    SCHEDULE_EVENT_FULL_DAYS_BLOCK = "schedule-event-full-days-block"
    SCHEDULE_EVENT_IN_DAY = "schedule-event-in-day"
    SCHEDULE_EXPORT = "schedule-export"
    SCHEDULE_STREAM = "schedule-stream"
    SMART_LIST = "smart-list"
    SMART_LIST_ITEM = "smart-list-item"
    TIME_PLAN = "time-plan"
    TODO_TASK = "todo-task"
    VACATION = "vacation"

    def __str__(self) -> str:
        return str(self.value)
