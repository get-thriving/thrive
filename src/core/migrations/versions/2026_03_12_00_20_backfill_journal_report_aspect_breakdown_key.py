"""Backfill journal report key from project to aspect breakdown.

Revision ID: d4e5f6071829
Revises: c3b2a1908f7e
Create Date: 2026-03-12 00:20:00.000000
"""

from alembic import op
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision = "d4e5f6071829"
down_revision = "c3b2a1908f7e"
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

    op.execute(
        """
        UPDATE journal_stats
        SET report = REPLACE(
            report,
            '"per_project_breakdown":',
            '"per_aspect_breakdown":'
        )
        WHERE report LIKE '%"per_project_breakdown"%'
        """
    )

    op.execute(
        """
        UPDATE journal_stats
        SET report = REPLACE(
            report,
            '"project"',
            '"aspect"'
        )
        WHERE report LIKE '%"sources"%'
          AND report LIKE '%"project"%'
        """
    )


def downgrade() -> None:
    if not (_has_table("journal_stats") and _has_column("journal_stats", "report")):
        return

    op.execute(
        """
        UPDATE journal_stats
        SET report = REPLACE(
            report,
            '"per_aspect_breakdown":',
            '"per_project_breakdown":'
        )
        WHERE report LIKE '%"per_aspect_breakdown"%'
        """
    )

    op.execute(
        """
        UPDATE journal_stats
        SET report = REPLACE(
            report,
            '"aspect"',
            '"project"'
        )
        WHERE report LIKE '%"sources"%'
          AND report LIKE '%"aspect"%'
        """
    )
