"""The namespace of an inbox task."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class InboxTaskNamespace(EnumValue):
    """The namespace of an inbox task."""

    TODO_TASK = "todo-task"
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
    LIFE_PLAN_EVAL = "life-plan-eval"

    @property
    def allow_user_changes(self) -> bool:
        """Allow user changes for an inbox task."""
        # Keep synced with ts:inbox_tasks/namespace.ts
        return self in (
            InboxTaskNamespace.TODO_TASK,
            InboxTaskNamespace.BIG_PLAN,
            InboxTaskNamespace.SLACK_TASK,
            InboxTaskNamespace.EMAIL_TASK,
        )
