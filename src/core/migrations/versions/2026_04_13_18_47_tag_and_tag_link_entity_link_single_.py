"""'tag and tag link entity link single namespace'

Revision ID: c6d37d47f9ff
Revises: a7c9e1f3b5d6
Create Date: 2026-04-13 18:47:02.730367

"""

from alembic import op
from sqlalchemy import Column, String, inspect, text


revision = "c6d37d47f9ff"
down_revision = "a7c9e1f3b5d6"
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


_TAG_DISAMBIGUATE_SQL = """
UPDATE tag
SET name = name || ' (' || namespace || ')'
WHERE (tag_domain_ref_id, name) IN (
    SELECT tag_domain_ref_id, name
    FROM tag
    GROUP BY tag_domain_ref_id, name
    HAVING COUNT(*) > 1
)
"""


# Use char(58) for ':' so SQLAlchemy text() does not treat ':std' as a bind parameter.
_BACKFILL_TAG_LINK_OWNER_SQL = """
UPDATE tag_link SET owner =
  CASE namespace
    WHEN 'todo-task' THEN 'TodoTask' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'time-plan' THEN 'TimePlan' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'schedule-stream' THEN 'ScheduleStream' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'schedule-export' THEN 'ScheduleExport' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'schedule-event-in-day' THEN 'ScheduleEventInDay' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'schedule-event-full-days-block' THEN 'ScheduleEventFullDays' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'habit' THEN 'Habit' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'chore' THEN 'Chore' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'big-plan' THEN 'BigPlan' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'doc' THEN 'Doc' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'journal' THEN 'Journal' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'vacation' THEN 'Vacation' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'aspect' THEN 'Aspect' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'chapter' THEN 'Chapter' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'goal' THEN 'Goal' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'milestone' THEN 'Milestone' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'smart-list' THEN 'SmartList' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'smart-list-item' THEN 'SmartListItem' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'metric' THEN 'Metric' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'metric-entry' THEN 'MetricEntry' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'person' THEN 'Person' || char(58) || source_entity_ref_id || char(58) || 'std'
    WHEN 'occasion' THEN 'Occasion' || char(58) || source_entity_ref_id || char(58) || 'std'
    ELSE namespace || char(58) || source_entity_ref_id || char(58) || 'std'
  END
WHERE owner IS NULL
"""


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name != "sqlite":
        return

    # --- tag: single global name per domain ---
    if _has_column("tag", "namespace"):
        op.execute(text(_TAG_DISAMBIGUATE_SQL))
        if _has_index("tag", "ix_tag_tag_domain_ref_id_namespace_name"):
            op.drop_index(
                "ix_tag_tag_domain_ref_id_namespace_name",
                table_name="tag",
            )
        with op.batch_alter_table("tag") as batch_op:
            batch_op.drop_column("namespace")
        op.execute(
            "CREATE UNIQUE INDEX IF NOT EXISTS ix_tag_tag_domain_ref_id_name "
            "ON tag (tag_domain_ref_id, name)"
        )

    # --- tag_link: owner EntityLink ---
    if _has_column("tag_link", "namespace") and not _has_column("tag_link", "owner"):
        with op.batch_alter_table("tag_link") as batch_op:
            batch_op.add_column(Column("owner", String(256), nullable=True))

        op.execute(text(_BACKFILL_TAG_LINK_OWNER_SQL))

        if _has_index(
            "tag_link",
            "ix_tag_link_tag_domain_ref_id_namespace_source_entity_ref_id",
        ):
            op.drop_index(
                "ix_tag_link_tag_domain_ref_id_namespace_source_entity_ref_id",
                table_name="tag_link",
            )
        if _has_index("tag_link", "ix_tag_link_namespace_source_entity_ref_id"):
            op.drop_index(
                "ix_tag_link_namespace_source_entity_ref_id",
                table_name="tag_link",
            )

        with op.batch_alter_table("tag_link") as batch_op:
            batch_op.alter_column("owner", nullable=False)

        op.execute(
            "CREATE UNIQUE INDEX IF NOT EXISTS ix_tag_link_owner ON tag_link (owner)"
        )

        with op.batch_alter_table("tag_link") as batch_op:
            batch_op.drop_column("namespace")
            batch_op.drop_column("source_entity_ref_id")


def downgrade() -> None:
    pass
