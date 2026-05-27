from enum import Enum


class ReportBreakdown(str, Enum):
    ASPECTS = "aspects"
    BIG_PLANS = "big-plans"
    CHORES = "chores"
    GLOBAL = "global"
    GOALS = "goals"
    HABITS = "habits"
    PERIODS = "periods"

    def __str__(self) -> str:
        return str(self.value)
