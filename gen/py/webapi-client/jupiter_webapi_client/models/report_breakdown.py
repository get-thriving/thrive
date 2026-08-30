from enum import StrEnum


class ReportBreakdown(StrEnum):
    ASPECTS = "aspects"
    BIG_PLANS = "big-plans"
    CHORES = "chores"
    GLOBAL = "global"
    GOALS = "goals"
    HABITS = "habits"
    PERIODS = "periods"

    def __str__(self) -> str:
        return str(self.value)
