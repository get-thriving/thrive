"""Tests for habit streak inactive periods."""

import pytest
from jupiter.core.apps.habits.sub.streak_inactive_period.root import (
    HabitStreakInactivePeriod,
    reset_streak_bounds,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.context import DomainContext
from jupiter.framework.errors import InputValidationError

TODAY = ADate.from_str("2026-03-10")
YESTERDAY = ADate.from_str("2026-03-09")


def _ctx() -> DomainContext:
    return DomainContext(
        trace_id=TraceId.new(),
        mutation_id=MutationId.new(),
        event_source="test",
        action_timestamp=Timestamp.from_components(2026, 3, 10, 0, 0),
        _context_str="test",
    )


def test_new_period_keeps_an_inclusive_range_and_a_name() -> None:
    period = HabitStreakInactivePeriod.new_habit_streak_inactive_period(
        _ctx(),
        habit_ref_id=EntityId("1"),
        name=EntityName("Trip"),
        start_date=ADate.from_str("2026-03-01"),
        end_date=ADate.from_str("2026-03-04"),
    )

    assert str(period.name) == "Trip"
    assert period.start_date == ADate.from_str("2026-03-01")
    assert period.end_date == ADate.from_str("2026-03-04")


def test_new_period_rejects_a_backwards_range() -> None:
    with pytest.raises(InputValidationError):
        HabitStreakInactivePeriod.new_habit_streak_inactive_period(
            _ctx(),
            habit_ref_id=EntityId("1"),
            name=EntityName("Trip"),
            start_date=ADate.from_str("2026-03-04"),
            end_date=ADate.from_str("2026-03-01"),
        )


def test_new_period_rejects_an_end_date_after_today() -> None:
    with pytest.raises(InputValidationError):
        HabitStreakInactivePeriod.new_habit_streak_inactive_period(
            _ctx(),
            habit_ref_id=EntityId("1"),
            name=EntityName("Trip"),
            start_date=TODAY,
            end_date=ADate.from_str("2026-03-11"),
        )


def test_reset_bounds_run_from_the_earliest_mark_through_yesterday() -> None:
    start_date, end_date = reset_streak_bounds(
        TODAY,
        ADate.from_str("2026-01-02"),
        ADate.from_str("2025-12-01"),
    )

    assert start_date == ADate.from_str("2026-01-02")
    assert end_date == YESTERDAY


def test_reset_bounds_fall_back_to_the_habit_creation_date() -> None:
    start_date, end_date = reset_streak_bounds(
        TODAY,
        None,
        ADate.from_str("2026-02-01"),
    )

    assert start_date == ADate.from_str("2026-02-01")
    assert end_date == YESTERDAY


def test_reset_bounds_reject_a_habit_with_nothing_before_today() -> None:
    with pytest.raises(InputValidationError):
        reset_streak_bounds(TODAY, None, TODAY)

    with pytest.raises(InputValidationError):
        reset_streak_bounds(TODAY, TODAY, ADate.from_str("2026-01-01"))
