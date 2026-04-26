"""Note owner as EntityLink string

Revision ID: a9c3e81d2f10
Revises: 1121d280b5c3
Create Date: 2026-04-08 23:00:00.000000

"""

from alembic import op
from sqlalchemy import Column, String, inspect, text


# revision identifiers, used by Alembic.
revision = "a9c3e81d2f10"
down_revision = "1121d280b5c3"
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
UPDATE note SET owner =
  CASE namespace
    WHEN 'todo-task' THEN 'TodoTask:' || source_entity_ref_id || ':' || 'std'
    WHEN 'working-mem' THEN 'WorkingMem:' || source_entity_ref_id || ':' || 'std'
    WHEN 'time-plan' THEN 'TimePlan:' || source_entity_ref_id || ':' || 'std'
    WHEN 'time-plan-activity' THEN 'TimePlanActivity:' || source_entity_ref_id || ':' || 'std'
    WHEN 'schedule-stream' THEN 'ScheduleStream:' || source_entity_ref_id || ':' || 'std'
    WHEN 'schedule-export' THEN 'ScheduleExport:' || source_entity_ref_id || ':' || 'std'
    WHEN 'schedule-event-in-day' THEN 'ScheduleEventInDay:' || source_entity_ref_id || ':' || 'std'
    WHEN 'schedule-event-full-days' THEN 'ScheduleEventFullDays:' || source_entity_ref_id || ':' || 'std'
    WHEN 'habit' THEN 'Habit:' || source_entity_ref_id || ':' || 'std'
    WHEN 'chore' THEN 'Chore:' || source_entity_ref_id || ':' || 'std'
    WHEN 'big-plan' THEN 'BigPlan:' || source_entity_ref_id || ':' || 'std'
    WHEN 'doc' THEN 'Doc:' || source_entity_ref_id || ':' || 'std'
    WHEN 'journal' THEN 'Journal:' || source_entity_ref_id || ':' || 'std'
    WHEN 'vacation' THEN 'Vacation:' || source_entity_ref_id || ':' || 'std'
    WHEN 'aspect' THEN 'Aspect:' || source_entity_ref_id || ':' || 'std'
    WHEN 'chapter' THEN 'Chapter:' || source_entity_ref_id || ':' || 'std'
    WHEN 'goal' THEN 'Goal:' || source_entity_ref_id || ':' || 'std'
    WHEN 'milestone' THEN 'Milestone:' || source_entity_ref_id || ':' || 'std'
    WHEN 'vision' THEN 'Vision:' || source_entity_ref_id || ':' || 'std'
    WHEN 'smart-list' THEN 'SmartList:' || source_entity_ref_id || ':' || 'std'
    WHEN 'smart-list-item' THEN 'SmartListItem:' || source_entity_ref_id || ':' || 'std'
    WHEN 'metric' THEN 'Metric:' || source_entity_ref_id || ':' || 'std'
    WHEN 'metric-entry' THEN 'MetricEntry:' || source_entity_ref_id || ':' || 'std'
    WHEN 'person' THEN 'Person:' || source_entity_ref_id || ':' || 'std'
    WHEN 'occasion' THEN 'Occasion:' || source_entity_ref_id || ':' || 'std'
    ELSE namespace || ':' || source_entity_ref_id || ':' || 'std'
  END
WHERE owner IS NULL
"""


def upgrade() -> None:
    if _has_column("note", "owner"):
        return
    if not _has_column("note", "namespace"):
        return

    with op.batch_alter_table("note") as batch_op:
        batch_op.add_column(Column("owner", String(256), nullable=True))

    op.execute(text(_BACKFILL_OWNER_SQL))

    if _has_index("note", "ix_note_domain_source_entity_ref_id"):
        op.drop_index(
            "ix_note_domain_source_entity_ref_id",
            table_name="note",
        )

    with op.batch_alter_table("note") as batch_op:
        batch_op.alter_column("owner", nullable=False)

    op.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS ix_note_owner ON note (owner)",
    )

    with op.batch_alter_table("note") as batch_op:
        batch_op.drop_column("namespace")
        batch_op.drop_column("source_entity_ref_id")


def downgrade() -> None:
    pass
