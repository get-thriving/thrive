"""Shared SQL for restricting schedule event time blocks to what a viewer may see."""

from typing import Final

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.framework.base.entity_id import EntityId
from sqlalchemy import ColumnElement, String, cast, column, false, literal, or_, select
from sqlalchemy import table as sql_table

# Levels that clear the READER bar. Derived from the enum rather than hardcoded
# so a future weaker level does not silently widen what calendars expose.
_LEVELS_ALLOWING_READER: Final[list[str]] = [
    level.value for level in AccessLevel if level.allows(AccessLevel.READER)
]


def visible_schedule_event_blocks_clause(
    block_owner_column: ColumnElement[str],
    event_table_name: str,
    owner_namespace: str,
    schedule_stream_ref_ids: list[EntityId],
    user_ref_id: EntityId | None,
) -> ColumnElement[bool]:
    """Match blocks whose schedule event the viewer may see.

    A block qualifies when its event belongs to one of the given schedule
    streams, or when the event is shared with the user. Both legs are
    correlated EXISTS subqueries so the database never returns blocks the
    viewer cannot see - the calendar path also serves an unauthenticated
    published-stream endpoint, where post-filtering in Python would be the
    only thing standing between one workspace's events and another's.

    Lightweight table constructs are used for the joined tables so this does
    not register (or collide with) their real definitions in any metadata.
    """
    legs: list[ColumnElement[bool]] = []

    if schedule_stream_ref_ids:
        event_table = sql_table(
            event_table_name,
            column("ref_id"),
            column("schedule_stream_ref_id"),
            column("archived"),
        )
        # Owner links are stored as `{type}:{purpose}:{ref_id}`, so rebuild the
        # event's link rather than parsing the block's - string concatenation
        # works the same on PostgreSQL and SQLite.
        event_owner_link = literal(f"{owner_namespace}:std:") + cast(
            event_table.c.ref_id, String
        )
        legs.append(
            select(literal(1))
            .select_from(event_table)
            .where(
                event_owner_link == block_owner_column,
                event_table.c.schedule_stream_ref_id.in_(
                    [ref_id.as_int() for ref_id in schedule_stream_ref_ids]
                ),
                event_table.c.archived.is_(False),
            )
            .exists()
        )

    if user_ref_id is not None:
        access_status_table = sql_table(
            "access_status",
            column("entity"),
            column("user_ref_id"),
            column("access_level"),
        )
        legs.append(
            select(literal(1))
            .select_from(access_status_table)
            .where(
                access_status_table.c.entity == block_owner_column,
                access_status_table.c.user_ref_id == user_ref_id.as_int(),
                access_status_table.c.access_level.in_(_LEVELS_ALLOWING_READER),
            )
            .exists()
        )

    if not legs:
        # No streams in view and no user to share with: nothing is visible.
        return false()

    return or_(*legs)
