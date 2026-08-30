"""Tests for the buffers around a time event in day block."""

import pytest
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    MAX_BUFFER_MINS,
    TimeEventInDayBlock,
)
from jupiter.core.common.time_in_day import TimeInDay
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.context import DomainContext
from jupiter.framework.errors import InputValidationError
from jupiter.framework.update_action import UpdateAction


def _ctx() -> DomainContext:
    return DomainContext(
        trace_id=TraceId.new(),
        mutation_id=MutationId.new(),
        event_source="test",
        action_timestamp=Timestamp.from_unix_timestamp(0),
        _context_str="test",
    )


def _new_block(
    buffer_before_mins: int | None = None,
    buffer_after_mins: int | None = None,
) -> TimeEventInDayBlock:
    return TimeEventInDayBlock.new_time_event_for_big_plan(
        _ctx(),
        time_event_domain_ref_id=EntityId("1"),
        big_plan_ref_id=EntityId("2"),
        start_date=ADate.from_str("2026-01-01"),
        start_time_in_day=TimeInDay.from_parts(10, 0),
        duration_mins=60,
        buffer_before_mins=buffer_before_mins,
        buffer_after_mins=buffer_after_mins,
    )


def test_new_block_has_no_buffers_by_default() -> None:
    block = _new_block()

    assert block.buffer_before_mins is None
    assert block.buffer_after_mins is None


def test_new_block_keeps_the_buffers_it_was_given() -> None:
    block = _new_block(buffer_before_mins=15, buffer_after_mins=30)

    assert block.buffer_before_mins == 15
    assert block.buffer_after_mins == 30


@pytest.mark.parametrize("buffer_mins", [0, -5, MAX_BUFFER_MINS + 1])
def test_new_block_rejects_a_buffer_outside_the_allowed_range(
    buffer_mins: int,
) -> None:
    with pytest.raises(InputValidationError):
        _new_block(buffer_before_mins=buffer_mins)

    with pytest.raises(InputValidationError):
        _new_block(buffer_after_mins=buffer_mins)


def test_update_leaves_the_buffers_alone_when_asked_to_do_nothing() -> None:
    block = _new_block(buffer_before_mins=15, buffer_after_mins=30)

    block = block.update(
        _ctx(),
        start_date=UpdateAction.do_nothing(),
        start_time_in_day=UpdateAction.do_nothing(),
        duration_mins=UpdateAction.change_to(90),
        buffer_before_mins=UpdateAction.do_nothing(),
        buffer_after_mins=UpdateAction.do_nothing(),
    )

    assert block.duration_mins == 90
    assert block.buffer_before_mins == 15
    assert block.buffer_after_mins == 30


def test_update_can_clear_a_buffer() -> None:
    block = _new_block(buffer_before_mins=15, buffer_after_mins=30)

    block = block.update(
        _ctx(),
        start_date=UpdateAction.do_nothing(),
        start_time_in_day=UpdateAction.do_nothing(),
        duration_mins=UpdateAction.do_nothing(),
        buffer_before_mins=UpdateAction.change_to(None),
        buffer_after_mins=UpdateAction.change_to(45),
    )

    assert block.buffer_before_mins is None
    assert block.buffer_after_mins == 45


def test_update_rejects_a_buffer_outside_the_allowed_range() -> None:
    block = _new_block()

    with pytest.raises(InputValidationError):
        block.update(
            _ctx(),
            start_date=UpdateAction.do_nothing(),
            start_time_in_day=UpdateAction.do_nothing(),
            duration_mins=UpdateAction.do_nothing(),
            buffer_before_mins=UpdateAction.change_to(MAX_BUFFER_MINS + 1),
            buffer_after_mins=UpdateAction.do_nothing(),
        )
