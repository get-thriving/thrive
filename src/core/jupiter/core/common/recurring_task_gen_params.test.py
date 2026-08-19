"""Tests for recurring task gen params."""

from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.recurring_task_gen_params import RecurringTaskGenParams
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.recurring_task_skip_rule import RecurringTaskSkipRule
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_name import EntityName

NAME = EntityName("A task")
# Week 51 of 2023, an odd week: Monday 2023-12-18 through Sunday 2023-12-24.
WEEK_START = ADate.from_str("2023-12-18")
WEEK_END = ADate.from_str("2023-12-24")
# An even week: Monday 2023-12-11 through Sunday 2023-12-17.
EVEN_WEEK_START = ADate.from_str("2023-12-11")
EVEN_WEEK_END = ADate.from_str("2023-12-17")
TUESDAY = ADate.from_str("2023-12-19")


def _params(
    period: RecurringTaskPeriod,
    skip_rule: RecurringTaskSkipRule | None = None,
) -> RecurringTaskGenParams:
    return RecurringTaskGenParams(
        period=period,
        eisen=Eisen.REGULAR,
        difficulty=Difficulty.EASY,
        actionable_from_day=None,
        actionable_from_month=None,
        due_at_day=None,
        due_at_month=None,
        skip_rule=skip_rule,
    )


def test_weekly_even_skip_hides_odd_week() -> None:
    params = _params(RecurringTaskPeriod.WEEKLY, RecurringTaskSkipRule.do_even())

    assert params.would_generate_in_time_plan(WEEK_START, WEEK_END, NAME) is False
    assert (
        params.would_generate_in_time_plan(EVEN_WEEK_START, EVEN_WEEK_END, NAME) is True
    )


def test_weekly_even_skip_keeps_only_one_of_adjacent_2026_weeks() -> None:
    params = _params(RecurringTaskPeriod.WEEKLY, RecurringTaskSkipRule.do_even())
    # Week 35 (odd): Mon 2026-08-24 through Sun 2026-08-30.
    odd_week_start = ADate.from_str("2026-08-24")
    odd_week_end = ADate.from_str("2026-08-30")
    # Week 36 (even): Mon 2026-08-31 through Sun 2026-09-06, containing 1 Sep.
    even_week_start = ADate.from_str("2026-08-31")
    even_week_end = ADate.from_str("2026-09-06")
    first_of_sep = ADate.from_str("2026-09-01")

    assert (
        params.would_generate_in_time_plan(odd_week_start, odd_week_end, NAME) is False
    )
    assert (
        params.would_generate_in_time_plan(even_week_start, even_week_end, NAME) is True
    )
    assert (
        params.would_generate_in_time_plan(odd_week_start, odd_week_start, NAME)
        is False
    )
    assert params.would_generate_in_time_plan(first_of_sep, first_of_sep, NAME) is True


def test_weekly_odd_skip_keeps_odd_week() -> None:
    params = _params(RecurringTaskPeriod.WEEKLY, RecurringTaskSkipRule.do_odd())

    assert params.would_generate_in_time_plan(WEEK_START, WEEK_END, NAME) is True
    assert (
        params.would_generate_in_time_plan(EVEN_WEEK_START, EVEN_WEEK_END, NAME)
        is False
    )


def test_weekly_without_skip_always_generates() -> None:
    params = _params(RecurringTaskPeriod.WEEKLY)

    assert params.would_generate_in_time_plan(WEEK_START, WEEK_END, NAME) is True
    assert (
        params.would_generate_in_time_plan(EVEN_WEEK_START, EVEN_WEEK_END, NAME) is True
    )


def test_daily_even_skip_generates_some_days_in_week() -> None:
    params = _params(RecurringTaskPeriod.DAILY, RecurringTaskSkipRule.do_even())

    assert params.would_generate_in_time_plan(WEEK_START, WEEK_END, NAME) is True


def test_daily_custom_weekday_only_on_that_day() -> None:
    sunday_only = RecurringTaskSkipRule.do_custom_daily_rel_weekly([7])
    params = _params(RecurringTaskPeriod.DAILY, sunday_only)

    assert params.would_generate_in_time_plan(WEEK_START, WEEK_END, NAME) is True
    assert params.would_generate_in_time_plan(TUESDAY, TUESDAY, NAME) is False


def test_monthly_generates_inside_its_month() -> None:
    params = _params(RecurringTaskPeriod.MONTHLY)

    assert params.would_generate_in_time_plan(WEEK_START, WEEK_END, NAME) is True


def test_schedule_keep_predicate_can_block_generation() -> None:
    params = _params(RecurringTaskPeriod.WEEKLY)

    assert (
        params.would_generate_in_time_plan(
            WEEK_START, WEEK_END, NAME, schedule_keep_predicate=lambda _: False
        )
        is False
    )
