"""Tests for the schedule event visibility clause.

These guard an authorization boundary: the calendar load path that uses this
clause also serves the unauthenticated published-stream endpoint, so a clause
that matches too much would expose one workspace's events on another's
published calendar.
"""

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.time_events.impl.schedule_event_visibility import (
    visible_schedule_event_blocks_clause,
)
from jupiter.framework.base.entity_id import EntityId
from sqlalchemy import Boolean, Column, Date, Integer, MetaData, String, Table, select
from sqlalchemy.dialects import postgresql, sqlite

_METADATA = MetaData()
_BLOCKS = Table(
    "time_event_in_day_block",
    _METADATA,
    Column("ref_id", Integer),
    Column("owner", String),
    Column("start_date", Date),
    Column("archived", Boolean),
)


def _compiled_sql(
    schedule_stream_ref_ids: list[EntityId],
    user_ref_id: EntityId | None,
    dialect: object = None,
) -> str:
    clause = visible_schedule_event_blocks_clause(
        _BLOCKS.c.owner,
        "schedule_event_in_day",
        "ScheduleEventInDay",
        schedule_stream_ref_ids,
        user_ref_id,
    )
    statement = select(_BLOCKS).where(clause)
    return str(
        statement.compile(
            dialect=dialect or postgresql.dialect(),
            compile_kwargs={"literal_binds": True},
        )
    )


def test_no_streams_and_no_user_matches_nothing() -> None:
    # Fail closed: a viewer with neither streams in view nor an identity must
    # not see any shared blocks.
    sql = _compiled_sql([], None)
    assert "WHERE false" in sql
    assert "access_status" not in sql
    assert "schedule_event_in_day" not in sql


def test_public_stream_view_never_consults_access_status() -> None:
    # The published-stream endpoint passes no user. Visibility must rest
    # solely on the streams being published.
    sql = _compiled_sql([EntityId("7")], None)
    assert "access_status" not in sql
    assert "schedule_event_in_day" in sql
    assert "schedule_stream_ref_id IN (7)" in sql


def test_user_without_streams_only_matches_shares() -> None:
    sql = _compiled_sql([], EntityId("1"))
    assert "access_status" in sql
    assert "access_status.user_ref_id = 1" in sql
    assert "schedule_event_in_day" not in sql
    # Must not match Occasion/Vacation/etc. owners that also have access_status
    # rows - those collide on numeric ref_id with schedule events.
    # Postgres escapes LIKE wildcards as %% under literal_binds; SQLite keeps %.
    assert "LIKE 'ScheduleEventInDay:std:" in sql


def test_both_sources_are_ored_and_correlated_to_the_block() -> None:
    sql = _compiled_sql([EntityId("7"), EntityId("9")], EntityId("1"))
    assert " OR " in sql
    # Both legs must correlate to the outer block, otherwise an EXISTS that
    # matches any row at all would let every block through.
    assert sql.count("time_event_in_day_block.owner") >= 2
    assert "schedule_stream_ref_id IN (7, 9)" in sql
    assert "access_status.user_ref_id = 1" in sql
    assert "LIKE 'ScheduleEventInDay:std:" in sql


def test_archived_events_are_excluded_from_the_stream_source() -> None:
    sql = _compiled_sql([EntityId("7")], None)
    assert "schedule_event_in_day.archived IS false" in sql


def test_every_access_level_clears_the_reader_bar() -> None:
    # The clause filters on levels that allow READER. READER is the weakest
    # level today, so all of them qualify - this pins that assumption so a
    # newly added weaker level fails here rather than silently widening
    # what calendars expose.
    sql = _compiled_sql([], EntityId("1"))
    for level in AccessLevel:
        assert level.allows(AccessLevel.READER)
        assert f"'{level.value}'" in sql


def test_owner_link_is_rebuilt_with_the_std_purpose() -> None:
    # Blocks store owners as `{type}:{purpose}:{ref_id}`; the join rebuilds
    # that form rather than parsing it.
    sql = _compiled_sql([EntityId("7")], None)
    assert "'ScheduleEventInDay:std:'" in sql


def test_clause_compiles_for_sqlite_too() -> None:
    sql = _compiled_sql([EntityId("7")], EntityId("1"), dialect=sqlite.dialect())
    assert "access_status" in sql
    assert "schedule_event_in_day" in sql
