"""The kind of target of an activity."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class TimePlanActivityTarget(EnumValue):
    """The kind of entity a time plan activity is aimed at."""

    INBOX_TASK = "inbox-task"
    TODO_TASK = "todo-task"
    HABIT = "habit"
    CHORE = "chore"
    BIG_PLAN = "big-plan"
