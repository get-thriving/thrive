"""The namespace of a contact link."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class ContactNamespace(EnumValue):
    """The namespace of a contact link."""

    TODO_TASK = "todo-task"
    SCHEDULE_EVENT_IN_DAY = "schedule-event-in-day"
    SCHEDULE_EVENT_FULL_DAYS_BLOCK = "schedule-event-full-days-block"
    HABIT = "habit"
    CHORE = "chore"
    BIG_PLAN = "big-plan"
    VACATION = "vacation"
    SMART_LIST_ITEM = "smart-list-item"
    METRIC_ENTRY = "metric-entry"
    PERSON = "person"
