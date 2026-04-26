"""Time event in day block owner as EntityLink string

Revision ID: f4a6b8c0d2e4
Revises: de55884c2c52
Create Date: 2026-04-13 10:00:00.000000

"""

from alembic import op
from sqlalchemy import Column, String, inspect, text


revision = "f4a6b8c0d2e4"
down_revision = "de55884c2c52"
branch_labels = None
depends_on = None


def _has_index(table_name: str, index_name: str) -> bool:
    inspector = inspect(op.get_bind())
    if table_name not in inspector.get_table_names():
        return False
    return any(ix["name"] == index_name for ix in inspector.get_indexes(table_name))


def _has_column(table_name: str, column_name: str) -> bool:
    inspector = inspect(op.get_bind())
    if table_name not in inspector.get_table_names():
        return False
    return any(
        column["name"] == column_name for column in inspector.get_columns(table_name)
    )


_BACKFILL_OWNER_SQL = """
UPDATE time_event_in_day_block SET owner =
  CASE namespace
    WHEN 'schedule-event-in-day' THEN 'ScheduleEventInDay:' || source_entity_ref_id || ':' || 'std'
    WHEN 'big-plan' THEN 'BigPlan:' || source_entity_ref_id || ':' || 'std'
    WHEN 'todo-task' THEN 'TodoTask:' || source_entity_ref_id || ':' || 'std'
    WHEN 'habit' THEN 'Habit:' || source_entity_ref_id || ':' || 'std'
    WHEN 'chore' THEN 'Chore:' || source_entity_ref_id || ':' || 'std'
    WHEN 'time-plan-activity' THEN 'TimePlanActivity:' || source_entity_ref_id || ':' || 'std'
    ELSE namespace || ':' || source_entity_ref_id || ':' || 'std'
  END
WHERE owner IS NULL
"""


def upgrade() -> None:
    if _has_column("time_event_in_day_block", "owner"):
        return
    if not _has_column("time_event_in_day_block", "namespace"):
        return

    with op.batch_alter_table("time_event_in_day_block") as batch_op:
        batch_op.add_column(Column("owner", String(256), nullable=True))

    op.execute(text(_BACKFILL_OWNER_SQL))

    if _has_index(
        "time_event_in_day_block",
        "ix_time_event_in_day_block_namespace_source_entity_ref_id",
    ):
        op.drop_index(
            "ix_time_event_in_day_block_namespace_source_entity_ref_id",
            table_name="time_event_in_day_block",
        )

    with op.batch_alter_table("time_event_in_day_block") as batch_op:
        batch_op.alter_column("owner", nullable=False)

    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_time_event_in_day_block_owner ON time_event_in_day_block (owner)",
    )

    with op.batch_alter_table("time_event_in_day_block") as batch_op:
        batch_op.drop_column("namespace")
        batch_op.drop_column("source_entity_ref_id")


def downgrade() -> None:
    pass
