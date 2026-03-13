"""Backfill journal report with per_goal_breakdown.

Revision ID: e6f7a8b9c0d1
Revises: d4e5f6071829
Create Date: 2026-03-12 00:30:00.000000
"""

from alembic import op
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision = "e6f7a8b9c0d1"
down_revision = "d4e5f6071829"
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


def upgrade() -> None:
    if not (_has_table("journal_stats") and _has_column("journal_stats", "report")):
        return

    # Ensure report JSON always has the required per_goal_breakdown key.
    op.execute(
        """
        UPDATE journal_stats
        SET report = json_set(report, '$.per_goal_breakdown', json('[]'))
        WHERE json_type(report, '$.per_goal_breakdown') IS NULL
        """
    )


def downgrade() -> None:
    if not (_has_table("journal_stats") and _has_column("journal_stats", "report")):
        return
