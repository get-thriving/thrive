from enum import Enum


class DocsHelpSubject(str, Enum):
    BIG_PLANS = "big-plans"
    CHORES = "chores"
    DOCS = "docs"
    EMAIL_TASKS = "email-tasks"
    GAMIFICATION = "gamification"
    HABITS = "habits"
    HOME = "home"
    INBOX_TASKS = "inbox-tasks"
    JOURNALS = "journals"
    LIFE_PLAN = "life-plan"
    LIFE_PLANCHAPTERS = "life-plan/chapters"
    LIFE_PLANGOALS = "life-plan/goals"
    LIFE_PLANMILESTONES = "life-plan/milestones"
    LIFE_PLANPROJECTS = "life-plan/projects"
    LIFE_PLANVISIONS = "life-plan/visions"
    METRICS = "metrics"
    PRM = "prm"
    PRMCIRCLES = "prm/circles"
    PRMOCCASIONS = "prm/occasions"
    PRMPERSONS = "prm/persons"
    ROOT = "root"
    SCHEDULE = "schedule"
    SELF_HOSTING = "self-hosting"
    SLACK_TASKS = "slack-tasks"
    SMART_LISTS = "smart-lists"
    TIME_PLANS = "time-plans"
    VACATIONS = "vacations"
    WORKING_MEM = "working-mem"

    def __str__(self) -> str:
        return str(self.value)
