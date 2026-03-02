"""The namespace of a contact link."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class ContactNamespace(EnumValue):
    """The namespace of a contact link."""

    INBOX_TASK = "inbox-task"
    TIME_PLAN = "time-plan"
    SCHEDULE_STREAM = "schedule-stream"
    SCHEDULE_EVENT_IN_DAY = "schedule-event-in-day"
    SCHEDULE_EVENT_FULL_DAYS_BLOCK = "schedule-event-full-days-block"
    HABIT = "habit"
    CHORE = "chore"
    BIG_PLAN = "big-plan"
    DOC = "doc"
    JOURNAL = "journal"
    VACATION = "vacation"
    PROJECT = "project"
    CHAPTER = "chapter"
    GOAL = "goal"
    MILESTONE = "milestone"
    SMART_LIST = "smart-list"
    SMART_LIST_ITEM = "smart-list-item"
    METRIC = "metric"
    METRIC_ENTRY = "metric-entry"
    PERSON = "person"
    OCCASION = "occasion"
