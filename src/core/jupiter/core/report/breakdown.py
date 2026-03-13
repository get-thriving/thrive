"""Options for the breakdowns in a report."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class ReportBreakdown(EnumValue):
    """Options for the breakdowns in a report."""

    GLOBAL = "global"
    PERIODS = "periods"
    ASPECTS = "aspects"
    GOALS = "goals"
    HABITS = "habits"
    CHORES = "chores"
    BIG_PLANS = "big-plans"
