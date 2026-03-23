"""Time event namespace."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class TimeEventNamespace(EnumValue):
    """Time event namespaces."""

    SCHEDULE_EVENT_IN_DAY = "schedule-event-in-day"
    SCHEDULE_FULL_DAYS_BLOCK = "schedule-full-days-block"
    INBOX_TASK = "inbox-task"
    BIG_PLAN = "big-plan"
    PERSON_OCCASION = "person-occasion"
    TODO_TASK = "todo-task"
    HABIT = "habit"
    CHORE = "chore"
    VACATION = "vacation"
