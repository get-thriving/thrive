from enum import Enum


class SyncTarget(str, Enum):
    ASPECTS = "aspects"
    PROJECTS = "projects"
    CHAPTERS = "chapters"
    CHORES = "chores"
    CIRCLES = "circles"
    DOCS = "docs"
    EMAIL_TASKS = "email-tasks"
    GAMIFICATION = "gamification"
    GOALS = "goals"
    HABITS = "habits"
    JOURNALS = "journals"
    LIFE_PLAN_EVAL = "life-plan-eval"
    METRICS = "metrics"
    MILESTONES = "milestones"
    OCCASIONS = "occasions"
    PERSONS = "persons"
    SCHEDULE = "schedule"
    SLACK_TASKS = "slack-tasks"
    SMART_LISTS = "smart-lists"
    TIME_PLANS = "time-plans"
    TODO_TASKS = "todo-tasks"
    VACATIONS = "vacations"
    VISIONS = "visions"
    WORKING_MEM = "working-mem"

    def __str__(self) -> str:
        return str(self.value)
