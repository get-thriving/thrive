from enum import Enum


class ReportBreakdown(str, Enum):
    ASPECTS = "aspects"
    CHORES = "chores"
    GLOBAL = "global"
    GOALS = "goals"
    HABITS = "habits"
    PERIODS = "periods"
    PROJECTS = "projects"

    def __str__(self) -> str:
        return str(self.value)
