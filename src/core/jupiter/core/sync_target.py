"""What exactly to sync."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class SyncTarget(EnumValue):
    """What exactly to generate, gc, or look at systematically."""

    INBOX_TASKS = "inbox-tasks"
    TODO_TASKS = "todo-tasks"
    WORKING_MEM = "working-mem"
    TIME_PLANS = "time-plans"
    SCHEDULES = "schedule"
    HABITS = "habits"
    CHORES = "chores"
    BIG_PLANS = "big-plans"
    JOURNALS = "journals"
    DOCS = "docs"
    VACATIONS = "vacations"
    ASPECTS = "aspects"
    CHAPTERS = "chapters"
    GOALS = "goals"
    MILESTONES = "milestones"
    VISIONS = "visions"
    SMART_LISTS = "smart-lists"
    METRICS = "metrics"
    PERSONS = "persons"
    OCCASIONS = "occasions"
    CIRCLES = "circles"
    SLACK_TASKS = "slack-tasks"
    EMAIL_TASKS = "email-tasks"
    GAMIFICATION = "gamification"
    LIFE_PLAN_EVAL = "life-plan-eval"
