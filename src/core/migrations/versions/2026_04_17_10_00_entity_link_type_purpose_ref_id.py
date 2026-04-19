"""EntityLink wire form type:purpose:ref_id (was type:ref_id:purpose)

Revision ID: b8e2f4a6c0d1
Revises: d4e8f0a1b2c3
Create Date: 2026-04-17 10:00:00.000000

"""

from alembic import op
from sqlalchemy import inspect, text


revision = "b8e2f4a6c0d1"
down_revision = "c6d37d47f9ff"
branch_labels = None
depends_on = None

_OWNER_TABLES = (
    "note",
    "contact_link",
    "tag_link",
    "time_event_in_day_block",
    "time_event_full_days_block",
    "inbox_task",
)


def _has_column(table_name: str, column_name: str) -> bool:
    inspector = inspect(op.get_bind())
    if table_name not in inspector.get_table_names():
        return False
    return any(
        column["name"] == column_name for column in inspector.get_columns(table_name)
    )


def _transform_old_to_new(owner: str) -> str:
    """``the_type:ref_id:purpose`` -> ``the_type:purpose:ref_id``."""
    the_type, ref_id, purpose = owner.rsplit(":", 2)
    return f"{the_type}:{purpose}:{ref_id}"


def _transform_new_to_old(owner: str) -> str:
    """``the_type:purpose:ref_id`` -> ``the_type:ref_id:purpose``."""
    the_type, purpose, ref_id = owner.rsplit(":", 2)
    return f"{the_type}:{ref_id}:{purpose}"


def upgrade() -> None:
    bind = op.get_bind()
    for table in _OWNER_TABLES:
        if not _has_column(table, "owner"):
            continue
        rows = bind.execute(
            text(f"SELECT ref_id, owner FROM {table}")  # nosec B608
        ).fetchall()
        for ref_id, owner in rows:
            if owner is None:
                continue
            stmt = text(
                f"UPDATE {table} SET owner = :owner WHERE ref_id = :ref_id"  # nosec B608
            )
            bind.execute(
                stmt, {"owner": _transform_old_to_new(owner), "ref_id": ref_id}
            )


def downgrade() -> None:
    bind = op.get_bind()
    for table in _OWNER_TABLES:
        if not _has_column(table, "owner"):
            continue
        rows = bind.execute(
            text(f"SELECT ref_id, owner FROM {table}")  # nosec B608
        ).fetchall()
        for ref_id, owner in rows:
            if owner is None:
                continue
            stmt = text(
                f"UPDATE {table} SET owner = :owner WHERE ref_id = :ref_id"  # nosec B608
            )
            bind.execute(
                stmt, {"owner": _transform_new_to_old(owner), "ref_id": ref_id}
            )
