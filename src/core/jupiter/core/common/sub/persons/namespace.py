"""The namespace of a person link."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class PersonNamespace(EnumValue):
    """The namespace of a person link."""

    PRM = "prm"
    INBOX_TASK = "inbox-task"
    BIG_PLAN = "big-plan"
    SCHEDULE = "schedule"
    HABIT = "habit"
    CHORE = "chore"
    SMART_LIST_ITEM = "smart-list-item"
    METRIC_ENTRY = "metric-entry"
