"""Contact link owner as EntityLink string

Revision ID: b2c4d8e0f1a3
Revises: a9c3e81d2f10
Create Date: 2026-04-09 12:00:00.000000

"""

from alembic import op
from sqlalchemy import Column, String, inspect, text


revision = "b2c4d8e0f1a3"
down_revision = "a9c3e81d2f10"
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
UPDATE contact_link SET owner =
  CASE namespace
    WHEN 'todo-task' THEN 'TodoTask:' || source_entity_ref_id || ':' || 'std'
    WHEN 'schedule-event-in-day' THEN 'ScheduleEventInDay:' || source_entity_ref_id || ':' || 'std'
    WHEN 'schedule-event-full-days-block' THEN 'ScheduleEventFullDays:' || source_entity_ref_id || ':' || 'std'
    WHEN 'habit' THEN 'Habit:' || source_entity_ref_id || ':' || 'std'
    WHEN 'chore' THEN 'Chore:' || source_entity_ref_id || ':' || 'std'
    WHEN 'big-plan' THEN 'BigPlan:' || source_entity_ref_id || ':' || 'std'
    WHEN 'vacation' THEN 'Vacation:' || source_entity_ref_id || ':' || 'std'
    WHEN 'smart-list-item' THEN 'SmartListItem:' || source_entity_ref_id || ':' || 'std'
    WHEN 'metric-entry' THEN 'MetricEntry:' || source_entity_ref_id || ':' || 'std'
    WHEN 'person' THEN 'Person:' || source_entity_ref_id || ':' || 'std'
    WHEN 'aspect' THEN 'Aspect:' || source_entity_ref_id || ':' || 'std'
    ELSE namespace || ':' || source_entity_ref_id || ':' || 'std'
  END
WHERE owner IS NULL
"""


def upgrade() -> None:
    if _has_column("contact_link", "owner"):
        return
    if not _has_column("contact_link", "namespace"):
        return

    with op.batch_alter_table("contact_link") as batch_op:
        batch_op.add_column(Column("owner", String(256), nullable=True))

    op.execute(text(_BACKFILL_OWNER_SQL))

    if _has_index(
        "contact_link",
        "ix_contact_link_contact_domain_ref_id_namespace_source_entity_ref_id",
    ):
        op.drop_index(
            "ix_contact_link_contact_domain_ref_id_namespace_source_entity_ref_id",
            table_name="contact_link",
        )
    if _has_index(
        "contact_link",
        "ix_contact_link_namespace_source_entity_ref_id",
    ):
        op.drop_index(
            "ix_contact_link_namespace_source_entity_ref_id",
            table_name="contact_link",
        )

    with op.batch_alter_table("contact_link") as batch_op:
        batch_op.alter_column("owner", nullable=False)

    op.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS ix_contact_link_owner ON contact_link (owner)",
    )

    with op.batch_alter_table("contact_link") as batch_op:
        batch_op.drop_column("namespace")
        batch_op.drop_column("source_entity_ref_id")


def downgrade() -> None:
    pass
