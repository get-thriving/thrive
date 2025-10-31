"""Tests for the timeline module."""

import pytest
from jupiter.core.domainx.core.recurring_task_period import RecurringTaskPeriod
from jupiter.core.domainx.core.timeline import infer_timeline
from jupiter.framework.base.timestamp import Timestamp


def test_infer_timeline_none_period() -> None:
    """Test infer_timeline with None period returns Lifetime."""
    mid_january_2024 = Timestamp.from_components(2024, 1, 15, 10, 30)
    result = infer_timeline(None, mid_january_2024)
    assert result == "Lifetime"


@pytest.mark.parametrize(
    ("datetime_input", "expected_timeline"),
    [
        (Timestamp.from_components(2024, 1, 15, 10, 30), "2024,Q1,Jan,W3,D1"),  # Monday
        (
            Timestamp.from_components(2024, 1, 16, 10, 30),
            "2024,Q1,Jan,W3,D2",
        ),  # Tuesday
        (
            Timestamp.from_components(2024, 1, 17, 10, 30),
            "2024,Q1,Jan,W3,D3",
        ),  # Wednesday
        (
            Timestamp.from_components(2024, 1, 18, 10, 30),
            "2024,Q1,Jan,W3,D4",
        ),  # Thursday
        (Timestamp.from_components(2024, 1, 19, 10, 30), "2024,Q1,Jan,W3,D5"),  # Friday
        (
            Timestamp.from_components(2024, 1, 20, 10, 30),
            "2024,Q1,Jan,W3,D6",
        ),  # Saturday
        (Timestamp.from_components(2024, 1, 21, 10, 30), "2024,Q1,Jan,W3,D7"),  # Sunday
    ],
)
def test_infer_timeline_daily_period_different_days(
    datetime_input: Timestamp, expected_timeline: str
) -> None:
    """Test infer_timeline with DAILY period for different days of the week."""
    timestamp = datetime_input
    result = infer_timeline(RecurringTaskPeriod.DAILY, timestamp)
    assert result == expected_timeline


@pytest.mark.parametrize(
    ("datetime_input", "expected_timeline"),
    [
        (Timestamp.from_components(2024, 1, 15, 10, 30), "2024,Q1,Jan,W3,D1"),  # Q1
        (Timestamp.from_components(2024, 4, 15, 10, 30), "2024,Q2,Apr,W16,D1"),  # Q2
        (Timestamp.from_components(2024, 7, 15, 10, 30), "2024,Q3,Jul,W29,D1"),  # Q3
        (Timestamp.from_components(2024, 10, 15, 10, 30), "2024,Q4,Oct,W42,D2"),  # Q4
    ],
)
def test_infer_timeline_daily_period_different_quarters(
    datetime_input: Timestamp, expected_timeline: str
) -> None:
    """Test infer_timeline with DAILY period for different quarters."""
    result = infer_timeline(RecurringTaskPeriod.DAILY, datetime_input)
    assert result == expected_timeline


@pytest.mark.parametrize(
    ("datetime_input", "expected_timeline"),
    [
        (Timestamp.from_components(2024, 1, 1, 10, 30), "2024,Q1,Jan,W1"),  # Week 1
        (Timestamp.from_components(2024, 1, 8, 10, 30), "2024,Q1,Jan,W2"),  # Week 2
        (Timestamp.from_components(2024, 12, 23, 10, 30), "2024,Q4,Dec,W52"),  # Week 52
        (
            Timestamp.from_components(2024, 12, 30, 10, 30),
            "2024,Q4,Dec,W53",
        ),  # Week 1 of next year
    ],
)
def test_infer_timeline_weekly_period_different_weeks(
    datetime_input: Timestamp, expected_timeline: str
) -> None:
    """Test infer_timeline with WEEKLY period for different weeks."""
    result = infer_timeline(RecurringTaskPeriod.WEEKLY, datetime_input)
    assert result == expected_timeline


def test_infer_timeline_weekly_period_uses_start_of_week() -> None:
    """Test that WEEKLY period uses start of week for timeline calculation."""
    # Wednesday of week 2 should still return week 2 timeline
    wednesday_week_2 = Timestamp.from_components(2024, 1, 10, 10, 30)
    result = infer_timeline(RecurringTaskPeriod.WEEKLY, wednesday_week_2)
    expected = "2024,Q1,Jan,W2"
    assert result == expected


@pytest.mark.parametrize(
    ("datetime_input", "expected_timeline"),
    [
        (Timestamp.from_components(2024, 1, 15, 10, 30), "2024,Q1,Jan"),
        (Timestamp.from_components(2024, 2, 15, 10, 30), "2024,Q1,Feb"),
        (Timestamp.from_components(2024, 3, 15, 10, 30), "2024,Q1,Mar"),
        (Timestamp.from_components(2024, 4, 15, 10, 30), "2024,Q2,Apr"),
        (Timestamp.from_components(2024, 5, 15, 10, 30), "2024,Q2,May"),
        (Timestamp.from_components(2024, 6, 15, 10, 30), "2024,Q2,Jun"),
        (Timestamp.from_components(2024, 7, 15, 10, 30), "2024,Q3,Jul"),
        (Timestamp.from_components(2024, 8, 15, 10, 30), "2024,Q3,Aug"),
        (Timestamp.from_components(2024, 9, 15, 10, 30), "2024,Q3,Sep"),
        (Timestamp.from_components(2024, 10, 15, 10, 30), "2024,Q4,Oct"),
        (Timestamp.from_components(2024, 11, 15, 10, 30), "2024,Q4,Nov"),
        (Timestamp.from_components(2024, 12, 15, 10, 30), "2024,Q4,Dec"),
    ],
)
def test_infer_timeline_monthly_period_different_months(
    datetime_input: Timestamp, expected_timeline: str
) -> None:
    """Test infer_timeline with MONTHLY period for different months."""
    result = infer_timeline(RecurringTaskPeriod.MONTHLY, datetime_input)
    assert result == expected_timeline


def test_infer_timeline_monthly_period_uses_start_of_month() -> None:
    """Test that MONTHLY period uses start of month for timeline calculation."""
    # End of month should still return the same month timeline
    end_of_month = Timestamp.from_components(2024, 1, 31, 23, 59)
    result = infer_timeline(RecurringTaskPeriod.MONTHLY, end_of_month)
    expected = "2024,Q1,Jan"
    assert result == expected


@pytest.mark.parametrize(
    ("datetime_input", "expected_timeline"),
    [
        (Timestamp.from_components(2024, 1, 15, 10, 30), "2024,Q1"),  # Q1
        (Timestamp.from_components(2024, 2, 15, 10, 30), "2024,Q1"),  # Q1
        (Timestamp.from_components(2024, 3, 15, 10, 30), "2024,Q1"),  # Q1
        (Timestamp.from_components(2024, 4, 15, 10, 30), "2024,Q2"),  # Q2
        (Timestamp.from_components(2024, 5, 15, 10, 30), "2024,Q2"),  # Q2
        (Timestamp.from_components(2024, 6, 15, 10, 30), "2024,Q2"),  # Q2
        (Timestamp.from_components(2024, 7, 15, 10, 30), "2024,Q3"),  # Q3
        (Timestamp.from_components(2024, 8, 15, 10, 30), "2024,Q3"),  # Q3
        (Timestamp.from_components(2024, 9, 15, 10, 30), "2024,Q3"),  # Q3
        (Timestamp.from_components(2024, 10, 15, 10, 30), "2024,Q4"),  # Q4
        (Timestamp.from_components(2024, 11, 15, 10, 30), "2024,Q4"),  # Q4
        (Timestamp.from_components(2024, 12, 15, 10, 30), "2024,Q4"),  # Q4
    ],
)
def test_infer_timeline_quarterly_period_different_quarters(
    datetime_input: Timestamp, expected_timeline: str
) -> None:
    """Test infer_timeline with QUARTERLY period for different quarters."""
    result = infer_timeline(RecurringTaskPeriod.QUARTERLY, datetime_input)
    assert result == expected_timeline


@pytest.mark.parametrize(
    ("datetime_input", "expected_timeline"),
    [
        (Timestamp.from_components(2023, 6, 15, 10, 30), "2023"),
        (Timestamp.from_components(2024, 1, 1, 0, 0), "2024"),
        (Timestamp.from_components(2024, 6, 15, 10, 30), "2024"),
        (Timestamp.from_components(2024, 12, 31, 23, 59), "2024"),
        (Timestamp.from_components(2025, 6, 15, 10, 30), "2025"),
    ],
)
def test_infer_timeline_yearly_period_different_years(
    datetime_input: Timestamp, expected_timeline: str
) -> None:
    """Test infer_timeline with YEARLY period for different years."""
    result = infer_timeline(RecurringTaskPeriod.YEARLY, datetime_input)
    assert result == expected_timeline


@pytest.mark.parametrize(
    ("datetime_input", "period", "expected_timeline", "description"),
    [
        (
            Timestamp.from_components(2024, 2, 29, 10, 30),
            RecurringTaskPeriod.DAILY,
            "2024,Q1,Feb,W9,D4",
            "leap year",
        ),
        (
            Timestamp.from_components(2024, 12, 31, 23, 59),
            RecurringTaskPeriod.DAILY,
            "2024,Q4,Dec,W1,D2",
            "new year's eve",
        ),
        (
            Timestamp.from_components(2025, 1, 1, 0, 0),
            RecurringTaskPeriod.DAILY,
            "2025,Q1,Jan,W1,D3",
            "new year's day",
        ),
    ],
)
def test_infer_timeline_edge_cases(
    datetime_input: Timestamp,
    period: RecurringTaskPeriod,
    expected_timeline: str,
    description: str,
) -> None:
    """Test infer_timeline with edge cases."""
    result = infer_timeline(period, datetime_input)
    assert result == expected_timeline


def test_infer_timeline_all_periods_same_date() -> None:
    """Test infer_timeline with all periods for the same date."""
    timestamp = Timestamp.from_components(2024, 6, 15, 14, 30)

    daily_result = infer_timeline(RecurringTaskPeriod.DAILY, timestamp)
    weekly_result = infer_timeline(RecurringTaskPeriod.WEEKLY, timestamp)
    monthly_result = infer_timeline(RecurringTaskPeriod.MONTHLY, timestamp)
    quarterly_result = infer_timeline(RecurringTaskPeriod.QUARTERLY, timestamp)
    yearly_result = infer_timeline(RecurringTaskPeriod.YEARLY, timestamp)

    # June 15, 2024 is a Saturday, week 24, Q2
    assert daily_result == "2024,Q2,Jun,W24,D6"
    assert weekly_result == "2024,Q2,Jun,W24"
    assert monthly_result == "2024,Q2,Jun"
    assert quarterly_result == "2024,Q2"
    assert yearly_result == "2024"


@pytest.mark.parametrize(
    ("datetime_input", "expected_timeline"),
    [
        (
            Timestamp.from_components(2024, 1, 7, 23, 59),
            "2024,Q1,Jan,W1,D7",
        ),  # Sunday (end of previous week)
        (
            Timestamp.from_components(2024, 1, 8, 0, 0),
            "2024,Q1,Jan,W2,D1",
        ),  # Monday (start of new week)
    ],
)
def test_infer_timeline_week_boundaries(
    datetime_input: Timestamp, expected_timeline: str
) -> None:
    """Test infer_timeline handles week boundaries correctly."""
    result = infer_timeline(RecurringTaskPeriod.DAILY, datetime_input)
    assert result == expected_timeline


@pytest.mark.parametrize(
    ("datetime_input", "expected_timeline"),
    [
        (
            Timestamp.from_components(2024, 1, 31, 23, 59),
            "2024,Q1,Jan",
        ),  # Last day of January
        (
            Timestamp.from_components(2024, 2, 1, 0, 0),
            "2024,Q1,Feb",
        ),  # First day of February
    ],
)
def test_infer_timeline_month_boundaries(
    datetime_input: Timestamp, expected_timeline: str
) -> None:
    """Test infer_timeline handles month boundaries correctly."""
    result = infer_timeline(RecurringTaskPeriod.MONTHLY, datetime_input)
    assert result == expected_timeline


@pytest.mark.parametrize(
    ("datetime_input", "expected_timeline"),
    [
        (
            Timestamp.from_components(2024, 3, 31, 23, 59),
            "2024,Q1",
        ),  # Last day of March (Q1)
        (
            Timestamp.from_components(2024, 4, 1, 0, 0),
            "2024,Q2",
        ),  # First day of April (Q2)
        (
            Timestamp.from_components(2024, 6, 30, 23, 59),
            "2024,Q2",
        ),  # Last day of June (Q2)
        (
            Timestamp.from_components(2024, 7, 1, 0, 0),
            "2024,Q3",
        ),  # First day of July (Q3)
    ],
)
def test_infer_timeline_quarter_boundaries(
    datetime_input: Timestamp, expected_timeline: str
) -> None:
    """Test infer_timeline handles quarter boundaries correctly."""
    result = infer_timeline(RecurringTaskPeriod.QUARTERLY, datetime_input)
    assert result == expected_timeline
