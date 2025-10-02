"""A history of user scores over time."""

from jupiter.framework_new.base.adateimport ADate
from jupiter.framework_new.value import CompositeValue, value


@value
class UserScoreAtDate(CompositeValue):
    """A full view of the score for a user."""

    date: ADate
    total_score: int
    inbox_task_cnt: int
    big_plan_cnt: int


@value
class UserScoreHistory(CompositeValue):
    """A history of user scores over time."""

    daily_scores: list[UserScoreAtDate]
    weekly_scores: list[UserScoreAtDate]
    monthly_scores: list[UserScoreAtDate]
    quarterly_scores: list[UserScoreAtDate]
