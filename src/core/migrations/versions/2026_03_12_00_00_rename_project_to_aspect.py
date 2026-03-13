"""Rename project naming to aspect naming.

Revision ID: 9f8e7d6c5b4a
Revises: abcabcabcabc
Create Date: 2026-03-12 00:00:00.000000
"""

from alembic import op
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision = "9f8e7d6c5b4a"
down_revision = "abcabcabcabc"
branch_labels = None
depends_on = None


def _has_table(table_name: str) -> bool:
    inspector = inspect(op.get_bind())
    return table_name in inspector.get_table_names()


def _has_column(table_name: str, column_name: str) -> bool:
    inspector = inspect(op.get_bind())
    if table_name not in inspector.get_table_names():
        return False
    return any(
        column["name"] == column_name for column in inspector.get_columns(table_name)
    )


def _rename_column_if_exists(table_name: str, source: str, target: str) -> None:
    if not _has_column(table_name, source):
        return
    if _has_column(table_name, target):
        return
    with op.batch_alter_table(table_name) as batch_op:
        batch_op.alter_column(source, new_column_name=target)


def upgrade() -> None:
    if _has_table("project"):
        op.rename_table("project", "aspect")
    if _has_table("project_event"):
        op.rename_table("project_event", "aspect_event")

    _rename_column_if_exists(
        "workspace", "default_project_ref_id", "default_aspect_ref_id"
    )
    op.execute("DROP INDEX IF EXISTS ix_project_parent_project_ref_id")
    _rename_column_if_exists("aspect", "parent_project_ref_id", "parent_aspect_ref_id")
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_aspect_parent_aspect_ref_id ON aspect (parent_aspect_ref_id) WHERE parent_aspect_ref_id IS NOT NULL;"
    )
    _rename_column_if_exists(
        "aspect", "order_of_child_projects", "order_of_child_aspects"
    )
    _rename_column_if_exists("chapter", "project_ref_id", "aspect_ref_id")
    _rename_column_if_exists("milestone", "project_ref_id", "aspect_ref_id")
    _rename_column_if_exists("goal", "project_ref_id", "aspect_ref_id")
    _rename_column_if_exists("inbox_task", "project_ref_id", "aspect_ref_id")
    _rename_column_if_exists("big_plan", "project_ref_id", "aspect_ref_id")
    _rename_column_if_exists("habit", "project_ref_id", "aspect_ref_id")
    _rename_column_if_exists("chore", "project_ref_id", "aspect_ref_id")
    op.rename_table("time_plan_project_link", "time_plan_aspect_link")
    _rename_column_if_exists("time_plan_aspect_link", "project_ref_id", "aspect_ref_id")
    _rename_column_if_exists(
        "slack_task_collection",
        "generation_project_ref_id",
        "generation_aspect_ref_id",
    )
    _rename_column_if_exists(
        "email_task_collection",
        "generation_project_ref_id",
        "generation_aspect_ref_id",
    )
    _rename_column_if_exists(
        "journal_collection",
        "writing_task_project_ref_id",
        "writing_task_aspect_ref_id",
    )
    _rename_column_if_exists(
        "working_mem_collection", "cleanup_project_ref_id", "cleanup_aspect_ref_id"
    )
    _rename_column_if_exists(
        "time_plan_domain",
        "planning_task_project_ref_id",
        "planning_task_aspect_ref_id",
    )
    _rename_column_if_exists(
        "metric_collection", "collection_project_ref_id", "collection_aspect_ref_id"
    )
    _rename_column_if_exists(
        "metric", "collection_project_ref_id", "collection_aspect_ref_id"
    )
    _rename_column_if_exists(
        "gen_log_entry", "filter_project_ref_ids", "filter_aspect_ref_ids"
    )
    _rename_column_if_exists("prm", "catch_up_project_ref_id", "catch_up_aspect_ref_id")
    _rename_column_if_exists(
        "person", "catch_up_project_ref_id", "catch_up_aspect_ref_id"
    )

    if _has_table("time_plan_project_link"):
        op.execute("DROP INDEX IF EXISTS ix_time_plan_project_link_project_ref_id")
        op.execute(
            "CREATE INDEX IF NOT EXISTS ix_time_plan_project_link_aspect_ref_id "
            "ON time_plan_project_link (aspect_ref_id)"
        )


def downgrade() -> None:
    _rename_column_if_exists(
        "time_plan_domain",
        "planning_task_aspect_ref_id",
        "planning_task_project_ref_id",
    )
    _rename_column_if_exists(
        "working_mem_collection", "cleanup_aspect_ref_id", "cleanup_project_ref_id"
    )
    _rename_column_if_exists(
        "journal_collection",
        "writing_task_aspect_ref_id",
        "writing_task_project_ref_id",
    )
    _rename_column_if_exists(
        "email_task_collection",
        "generation_aspect_ref_id",
        "generation_project_ref_id",
    )
    _rename_column_if_exists(
        "slack_task_collection",
        "generation_aspect_ref_id",
        "generation_project_ref_id",
    )
    _rename_column_if_exists(
        "time_plan_project_link", "aspect_ref_id", "project_ref_id"
    )
    _rename_column_if_exists("chore", "aspect_ref_id", "project_ref_id")
    _rename_column_if_exists("habit", "aspect_ref_id", "project_ref_id")
    _rename_column_if_exists("big_plan", "aspect_ref_id", "project_ref_id")
    _rename_column_if_exists("inbox_task", "aspect_ref_id", "project_ref_id")
    _rename_column_if_exists("goal", "aspect_ref_id", "project_ref_id")
    _rename_column_if_exists("milestone", "aspect_ref_id", "project_ref_id")
    _rename_column_if_exists("chapter", "aspect_ref_id", "project_ref_id")
    _rename_column_if_exists("aspect", "parent_aspect_ref_id", "parent_project_ref_id")
    _rename_column_if_exists(
        "aspect", "order_of_child_aspects", "order_of_child_projects"
    )
    _rename_column_if_exists(
        "workspace", "default_aspect_ref_id", "default_project_ref_id"
    )
    _rename_column_if_exists(
        "metric_collection", "collection_aspect_ref_id", "collection_project_ref_id"
    )
    _rename_column_if_exists(
        "metric", "collection_aspect_ref_id", "collection_project_ref_id"
    )
    _rename_column_if_exists(
        "gen_log_entry", "filter_aspect_ref_ids", "filter_project_ref_ids"
    )
    _rename_column_if_exists("prm", "catch_up_aspect_ref_id", "catch_up_project_ref_id")
    _rename_column_if_exists(
        "person", "catch_up_aspect_ref_id", "catch_up_project_ref_id"
    )

    if _has_table("time_plan_project_link"):
        op.execute("DROP INDEX IF EXISTS ix_time_plan_project_link_aspect_ref_id")
        op.execute(
            "CREATE INDEX IF NOT EXISTS ix_time_plan_project_link_project_ref_id "
            "ON time_plan_project_link (project_ref_id)"
        )

    if _has_table("aspect_event"):
        op.rename_table("aspect_event", "project_event")
    if _has_table("aspect"):
        op.rename_table("aspect", "project")
