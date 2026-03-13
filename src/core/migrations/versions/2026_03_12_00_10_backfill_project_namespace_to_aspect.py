"""Backfill namespace values from project to aspect.

Revision ID: c3b2a1908f7e
Revises: 9f8e7d6c5b4a
Create Date: 2026-03-12 00:10:00.000000
"""

from alembic import op
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision = "c3b2a1908f7e"
down_revision = "9f8e7d6c5b4a"
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


def _backfill_namespace(table_name: str) -> None:
    if not (_has_table(table_name) and _has_column(table_name, "namespace")):
        return
    op.execute(
        f"""
        UPDATE {table_name}
        SET namespace = 'aspect'
        WHERE namespace = 'project'
        """
    )


def upgrade() -> None:
    _backfill_namespace("note")
    _backfill_namespace("tag")
    _backfill_namespace("tag_link")
    _backfill_namespace("contact_link")
    _backfill_namespace("time_event_in_day_block")
    _backfill_namespace("time_event_full_days_block")

    if _has_table("search_index") and _has_column("search_index", "entity_tag"):
        op.execute(
            """
            UPDATE search_index
            SET entity_tag = 'Aspect'
            WHERE entity_tag = 'Project'
            """
        )


def downgrade() -> None:
    if _has_table("search_index") and _has_column("search_index", "entity_tag"):
        op.execute(
            """
            UPDATE search_index
            SET entity_tag = 'Project'
            WHERE entity_tag = 'Aspect'
            """
        )

    if _has_table("time_event_full_days_block") and _has_column(
        "time_event_full_days_block", "namespace"
    ):
        op.execute(
            """
            UPDATE time_event_full_days_block
            SET namespace = 'project'
            WHERE namespace = 'aspect'
            """
        )

    if _has_table("time_event_in_day_block") and _has_column(
        "time_event_in_day_block", "namespace"
    ):
        op.execute(
            """
            UPDATE time_event_in_day_block
            SET namespace = 'project'
            WHERE namespace = 'aspect'
            """
        )

    if _has_table("contact_link") and _has_column("contact_link", "namespace"):
        op.execute(
            """
            UPDATE contact_link
            SET namespace = 'project'
            WHERE namespace = 'aspect'
            """
        )

    if _has_table("tag_link") and _has_column("tag_link", "namespace"):
        op.execute(
            """
            UPDATE tag_link
            SET namespace = 'project'
            WHERE namespace = 'aspect'
            """
        )

    if _has_table("tag") and _has_column("tag", "namespace"):
        op.execute(
            """
            UPDATE tag
            SET namespace = 'project'
            WHERE namespace = 'aspect'
            """
        )

    if _has_table("note") and _has_column("note", "namespace"):
        op.execute(
            """
            UPDATE note
            SET namespace = 'project'
            WHERE namespace = 'aspect'
            """
        )
