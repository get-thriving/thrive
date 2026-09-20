"""Tests for scheduling params."""

import pytest
from jupiter.core.common.scheduling_params import (
    MAX_SCHEDULING_EVENT_COUNT,
    MAX_SCHEDULING_EVENT_DURATION_MINS,
    Schedulability,
    SchedulingParams,
    build_scheduling_params,
    build_scheduling_params_update,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.update_action import UpdateAction


def test_default_is_schedulable_without_hints() -> None:
    params = SchedulingParams.default()

    assert params.is_schedulable is True
    assert params.event_duration_mins is None
    assert params.event_count is None


def test_not_schedulable_has_no_load() -> None:
    params = SchedulingParams.not_schedulable()

    assert params.is_schedulable is False
    assert params.the_event_count == 0
    assert params.total_duration_mins(60) == 0


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
            event_count=None,
        )


@pytest.mark.parametrize("event_count", [0, -1, MAX_SCHEDULING_EVENT_COUNT + 1])
def test_out_of_range_counts_are_rejected(event_count: int) -> None:
    with pytest.raises(InputValidationError):
        SchedulingParams(
            schedulability=Schedulability.SCHEDULABLE,
            event_duration_mins=None,
            event_count=event_count,
        )


def test_duration_falls_back_on_the_inferred_one() -> None:
    params = SchedulingParams.default()

    assert params.the_event_duration_mins(45) == 45
    assert params.total_duration_mins(45) == 45


def test_duration_hint_wins_over_the_inferred_one() -> None:
    params = SchedulingParams(
        schedulability=Schedulability.SCHEDULABLE,
        event_duration_mins=90,
        event_count=None,
    )

    assert params.the_event_duration_mins(45) == 90
    assert params.total_duration_mins(45) == 90


def test_count_multiplies_the_total() -> None:
    params = SchedulingParams(
        schedulability=Schedulability.SCHEDULABLE,
        event_duration_mins=30,
        event_count=4,
    )

    assert params.the_event_count == 4
    assert params.total_duration_mins(15) == 120


def test_count_multiplies_the_inferred_duration_too() -> None:
    params = SchedulingParams(
        schedulability=Schedulability.SCHEDULABLE,
        event_duration_mins=None,
        event_count=3,
    )

    assert params.total_duration_mins(20) == 60


def test_build_drops_hints_for_not_schedulable() -> None:
    params = build_scheduling_params(Schedulability.NOT_SCHEDULABLE, 30, 2)

    assert params.is_schedulable is False
    assert params.event_duration_mins is None
    assert params.event_count is None


def test_build_defaults_when_nothing_is_asked_for() -> None:
    assert build_scheduling_params(None, None, None) == SchedulingParams.default()


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
