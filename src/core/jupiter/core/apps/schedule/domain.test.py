"""Tests for the schedule domain."""

import pytest
from jupiter.core.apps.schedule.domain import (
    MAX_ADDITIONAL_TIMEZONES,
    ScheduleDomain,
)
from jupiter.core.common.timezone import Timezone
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.context import DomainContext
from jupiter.framework.errors import InputValidationError
from jupiter.framework.update_action import UpdateAction


def _build_context() -> DomainContext:
    return DomainContext(
        trace_id=TraceId.new(),
        mutation_id=MutationId.new(),
        event_source="test",
        action_timestamp=Timestamp.from_components(2026, 8, 30, 0, 0),
        _context_str="test",
    )


def _build_schedule_domain() -> ScheduleDomain:
    return ScheduleDomain.new_schedule_domain(_build_context(), EntityId("1"))


def test_new_schedule_domain_has_no_additional_timezones() -> None:
    assert _build_schedule_domain().additional_timezones == []


def test_change_additional_timezones() -> None:
    schedule_domain = _build_schedule_domain().change_additional_timezones(
        _build_context(),
        additional_timezones=UpdateAction.change_to(
            [Timezone("Europe/Bucharest"), Timezone("America/New_York")]
        ),
    )

    assert schedule_domain.additional_timezones == [
        Timezone("Europe/Bucharest"),
        Timezone("America/New_York"),
    ]


def test_change_additional_timezones_leaves_them_be_when_not_changing() -> None:
    schedule_domain = _build_schedule_domain().change_additional_timezones(
        _build_context(),
        additional_timezones=UpdateAction.change_to([Timezone("Europe/Bucharest")]),
    )
    schedule_domain = schedule_domain.change_additional_timezones(
        _build_context(),
        additional_timezones=UpdateAction.do_nothing(),
    )

    assert schedule_domain.additional_timezones == [Timezone("Europe/Bucharest")]


def test_change_additional_timezones_refuses_too_many() -> None:
    too_many = [
        Timezone(f"Etc/GMT+{idx}") for idx in range(MAX_ADDITIONAL_TIMEZONES + 1)
    ]

    with pytest.raises(InputValidationError):
        _build_schedule_domain().change_additional_timezones(
            _build_context(),
            additional_timezones=UpdateAction.change_to(too_many),
        )


def test_change_additional_timezones_refuses_duplicates() -> None:
    with pytest.raises(InputValidationError):
        _build_schedule_domain().change_additional_timezones(
            _build_context(),
            additional_timezones=UpdateAction.change_to(
                [Timezone("Europe/Bucharest"), Timezone("Europe/Bucharest")]
            ),
        )
