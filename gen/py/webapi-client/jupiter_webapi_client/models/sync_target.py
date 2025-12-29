from enum import Enum


class SyncTarget(str, Enum):
    BIG_PLANS = "big-plans"
    CHAPTERS = "chapters"
    CHORES = "chores"
    DOCS = "docs"
    EMAIL_TASKS = "email-tasks"
    GAMIFICATION = "gamification"
    GOALS = "goals"
    HABITS = "habits"
    INBOX_TASKS = "inbox-tasks"
    JOURNALS = "journals"
    METRICS = "metrics"
    MILESTONES = "milestones"
    PERSONS = "persons"
    PROJECTS = "projects"
    SCHEDULE = "schedule"
    SLACK_TASKS = "slack-tasks"
    SMART_LISTS = "smart-lists"
    TIME_PLANS = "time-plans"
    VACATIONS = "vacations"
    VISIONS = "visions"
    WORKING_MEM = "working-mem"

    def __str__(self) -> str:
        return str(self.value)
