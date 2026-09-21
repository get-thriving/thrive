"""Tests for the full days blocks a big plan milestone owns."""

import pytest
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.context import DomainContext
from jupiter.framework.errors import InputValidationError


def _ctx() -> DomainContext:
    return DomainContext(
        trace_id=TraceId.new(),
        mutation_id=MutationId.new(),
        event_source="test",
        action_timestamp=Timestamp.from_unix_timestamp(0),
        _context_str="test",
    )


def _new_block(date: str = "2026-01-01") -> TimeEventFullDaysBlock:
    return TimeEventFullDaysBlock.new_time_event_for_big_plan_milestone(
        _ctx(),
        time_event_domain_ref_id=EntityId("1"),
        big_plan_milestone_ref_id=EntityId("2"),
        milestone_date=ADate.from_str(date),
    )


def test_new_block_for_milestone_covers_the_single_day() -> None:
    block = _new_block()

    assert block.owner == EntityLink.std(
        NamedEntityTag.BIG_PLAN_MILESTONE.value, EntityId("2")
    )
    assert block.start_date == ADate.from_str("2026-01-01")
    assert block.duration_days == 1
    assert block.end_date == ADate.from_str("2026-01-02")


def test_update_block_for_milestone_moves_the_day() -> None:
    block = _new_block().update_for_big_plan_milestone(
        _ctx(),
        milestone_date=ADate.from_str("2026-03-31"),
    )

    assert block.start_date == ADate.from_str("2026-03-31")
    assert block.duration_days == 1
    assert block.end_date == ADate.from_str("2026-04-01")


def test_a_milestone_block_only_takes_a_std_owner() -> None:
    with pytest.raises(InputValidationError):
        TimeEventFullDaysBlock._new_with_owner(
            _ctx(),
            EntityId("1"),
            EntityLink(
                the_type=NamedEntityTag.BIG_PLAN_MILESTONE.value,
                ref_id=EntityId("2"),
                purpose="other",
            ),
            ADate.from_str("2026-01-01"),
            1,
            ADate.from_str("2026-01-02"),
        )


def test_a_big_plan_cannot_own_a_full_days_block() -> None:
    with pytest.raises(InputValidationError):
        TimeEventFullDaysBlock._new_with_owner(
            _ctx(),
            EntityId("1"),
            EntityLink.std(NamedEntityTag.BIG_PLAN.value, EntityId("2")),
            ADate.from_str("2026-01-01"),
            1,
            ADate.from_str("2026-01-02"),
        )
