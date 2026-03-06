"""The namespace of a task."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class TaskNamespace(EnumValue):
    """The namespace of a task."""

    TODO = "todo"
    WORKING_MEM_CLEANUP = "working-mem-cleanup"
    TIME_PLAN = "time-plan"
    HABIT = "habit"
    CHORE = "chore"
    BIG_PLAN = "big-plan"
    JOURNAL = "journal"
    METRIC = "metric"
    PERSON_CATCH_UP = "person-catch-up"
    PERSON_OCCASION = "person-occasion"
    SLACK_TASK = "slack-task"
    EMAIL_TASK = "email-task"

    @property
    def allow_user_changes(self) -> bool:
        """Allow user changes for a task."""
        return self in (
            TaskNamespace.TODO,
            TaskNamespace.BIG_PLAN,
            TaskNamespace.SLACK_TASK,
            TaskNamespace.EMAIL_TASK,
        )
