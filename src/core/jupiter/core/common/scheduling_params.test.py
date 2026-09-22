"""Tests for scheduling params."""

import pytest
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.scheduling_params import (
    DEFAULT_SCHEDULING_EVENT_COUNT,
    DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
    MAX_SCHEDULING_EVENT_COUNT,
    MAX_SCHEDULING_EVENT_DURATION_MINS,
    Schedulability,
    SchedulingParams,
    build_scheduling_params,
    build_scheduling_params_update,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.update_action import UpdateAction


def test_default_is_schedulable_for_one_event() -> None:
    params = SchedulingParams.default()

    assert params.is_schedulable is True
    assert params.event_duration_mins == DEFAULT_SCHEDULING_EVENT_DURATION_MINS
    assert params.event_count == DEFAULT_SCHEDULING_EVENT_COUNT


def test_not_schedulable_has_no_load() -> None:
    params = SchedulingParams.not_schedulable()

    assert params.is_schedulable is False
    assert params.the_event_count == 0
    assert params.the_event_duration_mins == 0
    assert params.total_duration_mins == 0


def test_something_schedulable_needs_a_duration_and_a_count() -> None:
    with pytest.raises(InputValidationError):
        SchedulingParams(
            schedulability=Schedulability.SCHEDULABLE,
            event_duration_mins=None,
            event_count=1,
        )

    with pytest.raises(InputValidationError):
        SchedulingParams(
            schedulability=Schedulability.SCHEDULABLE,
            event_duration_mins=30,
            event_count=None,
        )


def test_hints_are_rejected_for_not_schedulable() -> None:
    with pytest.raises(InputValidationError):
        SchedulingParams(
            schedulability=Schedulability.NOT_SCHEDULABLE,
            event_duration_mins=30,
            event_count=None,
        )

    with pytest.raises(InputValidationError):
        SchedulingParams(
            schedulability=Schedulability.NOT_SCHEDULABLE,
            event_duration_mins=None,
            event_count=3,
        )


@pytest.mark.parametrize(
    "event_duration_mins",
    [0, -10, MAX_SCHEDULING_EVENT_DURATION_MINS + 1],
)
def test_out_of_range_durations_are_rejected(event_duration_mins: int) -> None:
    with pytest.raises(InputValidationError):
        SchedulingParams(
            schedulability=Schedulability.SCHEDULABLE,
            event_duration_mins=event_duration_mins,
            event_count=1,
        )


@pytest.mark.parametrize("event_count", [0, -1, MAX_SCHEDULING_EVENT_COUNT + 1])
def test_out_of_range_counts_are_rejected(event_count: int) -> None:
    with pytest.raises(InputValidationError):
        SchedulingParams(
            schedulability=Schedulability.SCHEDULABLE,
            event_duration_mins=30,
            event_count=event_count,
        )


def test_count_multiplies_the_total() -> None:
    params = SchedulingParams(
        schedulability=Schedulability.SCHEDULABLE,
        event_duration_mins=30,
        event_count=4,
    )

    assert params.the_event_count == 4
    assert params.the_event_duration_mins == 30
    assert params.total_duration_mins == 120


def test_build_drops_hints_for_not_schedulable() -> None:
    params = build_scheduling_params(Schedulability.NOT_SCHEDULABLE, 30, 2)

    assert params.is_schedulable is False
    assert params.event_duration_mins is None
    assert params.event_count is None


def test_build_fills_in_what_a_command_leaves_out() -> None:
    assert build_scheduling_params(None, None, None) == SchedulingParams.default()
    assert build_scheduling_params(Schedulability.SCHEDULABLE, None, None) == (
        SchedulingParams.default()
    )
    assert build_scheduling_params(Schedulability.SCHEDULABLE, 45, None) == (
        SchedulingParams(
            schedulability=Schedulability.SCHEDULABLE,
            event_duration_mins=45,
            event_count=DEFAULT_SCHEDULING_EVENT_COUNT,
        )
    )


def test_update_does_nothing_when_no_field_changes() -> None:
    update = build_scheduling_params_update(
        SchedulingParams.default(),
        UpdateAction.do_nothing(),
        UpdateAction.do_nothing(),
        UpdateAction.do_nothing(),
    )

    assert update.should_change is False


def test_update_keeps_the_fields_it_is_not_given() -> None:
    current = SchedulingParams(
        schedulability=Schedulability.SCHEDULABLE,
        event_duration_mins=30,
        event_count=2,
    )

    update = build_scheduling_params_update(
        current,
        UpdateAction.do_nothing(),
        UpdateAction.change_to(45),
        UpdateAction.do_nothing(),
    )

    assert update.just_the_value == SchedulingParams(
        schedulability=Schedulability.SCHEDULABLE,
        event_duration_mins=45,
        event_count=2,
    )


def test_update_to_not_schedulable_clears_the_hints() -> None:
    current = SchedulingParams(
        schedulability=Schedulability.SCHEDULABLE,
        event_duration_mins=30,
        event_count=2,
    )

    update = build_scheduling_params_update(
        current,
        UpdateAction.change_to(Schedulability.NOT_SCHEDULABLE),
        UpdateAction.do_nothing(),
        UpdateAction.do_nothing(),
    )

    assert update.just_the_value == SchedulingParams.not_schedulable()


def test_update_back_to_schedulable_takes_the_defaults() -> None:
    update = build_scheduling_params_update(
        SchedulingParams.not_schedulable(),
        UpdateAction.change_to(Schedulability.SCHEDULABLE),
        UpdateAction.do_nothing(),
        UpdateAction.do_nothing(),
    )

    assert update.just_the_value == SchedulingParams.default()


def test_default_for_follows_the_difficulty() -> None:
    assert SchedulingParams.default_for(Difficulty.EASY).event_duration_mins == 15
    assert SchedulingParams.default_for(Difficulty.MEDIUM).event_duration_mins == 30
    assert SchedulingParams.default_for(Difficulty.HARD).event_duration_mins == 60
    assert SchedulingParams.default_for(None) == SchedulingParams.default()
    assert all(
        SchedulingParams.default_for(d).event_count == DEFAULT_SCHEDULING_EVENT_COUNT
        for d in (None, Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD)
    )


def test_default_is_what_medium_difficulty_work_gets() -> None:
    assert DEFAULT_SCHEDULING_EVENT_DURATION_MINS == (
        Difficulty.MEDIUM.default_event_duration_mins
    )


def test_build_takes_the_duration_from_the_difficulty() -> None:
    assert build_scheduling_params(None, None, None, Difficulty.EASY) == (
        SchedulingParams(
            schedulability=Schedulability.SCHEDULABLE,
            event_duration_mins=15,
            event_count=DEFAULT_SCHEDULING_EVENT_COUNT,
        )
    )
    assert build_scheduling_params(None, None, 3, Difficulty.HARD) == (
        SchedulingParams(
            schedulability=Schedulability.SCHEDULABLE,
            event_duration_mins=60,
            event_count=3,
        )
    )


def test_build_prefers_an_explicit_duration_over_the_difficulty() -> None:
    params = build_scheduling_params(None, 45, None, Difficulty.HARD)

    assert params.event_duration_mins == 45


def test_update_back_to_schedulable_takes_the_difficulty() -> None:
    update = build_scheduling_params_update(
        SchedulingParams.not_schedulable(),
        UpdateAction.change_to(Schedulability.SCHEDULABLE),
        UpdateAction.do_nothing(),
        UpdateAction.do_nothing(),
        Difficulty.HARD,
    )

    assert update.just_the_value == SchedulingParams.default_for(Difficulty.HARD)


def test_update_keeps_a_stored_duration_over_the_difficulty() -> None:
    current = SchedulingParams(
        schedulability=Schedulability.SCHEDULABLE,
        event_duration_mins=45,
        event_count=2,
    )

    update = build_scheduling_params_update(
        current,
        UpdateAction.do_nothing(),
        UpdateAction.do_nothing(),
        UpdateAction.change_to(3),
        Difficulty.EASY,
    )

    assert update.just_the_value == SchedulingParams(
        schedulability=Schedulability.SCHEDULABLE,
        event_duration_mins=45,
        event_count=3,
    )
