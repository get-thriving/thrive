"""Inbox task owner EntityLink column (replaces namespace + source_entity_ref_id)

Revision ID: e8f9a0b1c2d3
Revises: d7e8f9a0b1c2
Create Date: 2026-04-24 18:30:00.000000

Backfill ``owner`` as ``{the_type}:std:{ref_id}`` to match ``EntityLink`` wire form.
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = "e8f9a0b1c2d3"
down_revision = "d7e8f9a0b1c2"
branch_labels = None
depends_on = None


def _has_column(table_name: str, column_name: str) -> bool:
    inspector = inspect(op.get_bind())
    if table_name not in inspector.get_table_names():
        return False
    return any(
        column["name"] == column_name for column in inspector.get_columns(table_name)
    )


def _has_index(table_name: str, index_name: str) -> bool:
    inspector = inspect(op.get_bind())
    if table_name not in inspector.get_table_names():
        return False
    return any(ix["name"] == index_name for ix in inspector.get_indexes(table_name))


def upgrade() -> None:
    if not _has_column("inbox_task", "namespace"):
        return

    if not _has_column("inbox_task", "owner"):
        with op.batch_alter_table("inbox_task") as batch_op:
            batch_op.add_column(sa.Column("owner", sa.String(), nullable=True))

    op.execute(
        """
        UPDATE inbox_task
        SET owner =
            CASE namespace
                WHEN 'todo-task' THEN 'TodoTask:std:' || CAST(source_entity_ref_id AS TEXT)
                WHEN 'working-mem-cleanup' THEN 'WorkingMemCollection:std:' || CAST(source_entity_ref_id AS TEXT)
                WHEN 'time-plan' THEN 'TimePlan:std:' || CAST(source_entity_ref_id AS TEXT)
                WHEN 'habit' THEN 'Habit:std:' || CAST(source_entity_ref_id AS TEXT)
                WHEN 'chore' THEN 'Chore:std:' || CAST(source_entity_ref_id AS TEXT)
                WHEN 'big-plan' THEN 'BigPlan:std:' || CAST(source_entity_ref_id AS TEXT)
                WHEN 'journal' THEN 'Journal:std:' || CAST(source_entity_ref_id AS TEXT)
                WHEN 'metric' THEN 'Metric:std:' || CAST(source_entity_ref_id AS TEXT)
                WHEN 'person-catch-up' THEN 'Person:std:' || CAST(source_entity_ref_id AS TEXT)
                WHEN 'person-occasion' THEN 'Occasion:std:' || CAST(source_entity_ref_id AS TEXT)
                WHEN 'slack-task' THEN 'SlackTask:std:' || CAST(source_entity_ref_id AS TEXT)
                WHEN 'email-task' THEN 'EmailTask:std:' || CAST(source_entity_ref_id AS TEXT)
                WHEN 'life-plan-eval' THEN 'LifePlan:std:' || CAST(source_entity_ref_id AS TEXT)
                ELSE NULL
            END
        WHERE source_entity_ref_id IS NOT NULL
        """
    )

    if _has_index("inbox_task", "ix_inbox_task_pagination"):
        op.drop_index("ix_inbox_task_pagination", table_name="inbox_task")
    if _has_index("inbox_task", "ix_inbox_task_source_entity_ref_id"):
        op.drop_index("ix_inbox_task_source_entity_ref_id", table_name="inbox_task")

    with op.batch_alter_table("inbox_task") as batch_op:
        batch_op.drop_column("namespace")
        batch_op.drop_column("source_entity_ref_id")

    with op.batch_alter_table("inbox_task") as batch_op:
        batch_op.alter_column("owner", nullable=False)

    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_inbox_task_pagination ON inbox_task "
        "(inbox_task_collection_ref_id, owner, created_time)"
    )


def downgrade() -> None:
    """Not supported: ``owner`` strings are lossy to rebuild legacy columns safely."""
