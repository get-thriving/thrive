"""Docs help subject."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class DocsHelpSubject(EnumValue):
    """A subject for docs help references."""

    ROOT = "root"
    HOME = "home"
    GAMIFICATION = "gamification"
    INBOX_TASKS = "inbox-tasks"
    WORKING_MEM = "working-mem"
    TIME_PLANS = "time-plans"
    SCHEDULE = "schedule"
    HABITS = "habits"
    CHORES = "chores"
    BIG_PLANS = "big-plans"
    JOURNALS = "journals"
    DOCS = "docs"
    VACATIONS = "vacations"
    LIFE_PLAN = "life-plan"
    PROJECTS = "life-plan/projects"
    CHAPTERS = "life-plan/chapters"
    GOALS = "life-plan/goals"
    MILESTONES = "life-plan/milestones"
    VISIONS = "life-plan/visions"
    SMART_LISTS = "smart-lists"
    METRICS = "metrics"
    PRM = "prm"
    PERSONS = "prm/persons"
    OCCASIONS = "prm/occasions"
    CIRCLES = "prm/circles"
    SLACK_TASKS = "slack-tasks"
    EMAIL_TASKS = "email-tasks"
    SELF_HOSTING = "self-hosting"
    API = "api"
    MCP = "mcp"