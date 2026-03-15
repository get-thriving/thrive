"""'Fix journals in some places'

Revision ID: c3e875ac8f62
Revises: b22f61d44fb3
Create Date: 2026-03-15 22:03:51.456179

"""
from alembic import op


# revision identifiers, used by Alembic.
revision = 'c3e875ac8f62'
down_revision = 'b22f61d44fb3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE gen_log_entry
        SET gen_targets = REPLACE(gen_targets, '"projects"', '"aspects"')
        WHERE gen_targets LIKE '%"projects"%'
        """
    )
    op.execute(
        """
        UPDATE stats_log_entry
        SET stats_targets = REPLACE(stats_targets, '"projects"', '"aspects"')
        WHERE stats_targets LIKE '%"projects"%'
        """
    )
    op.execute(
        """
        UPDATE gc_log_entry
        SET gc_targets = REPLACE(gc_targets, '"projects"', '"aspects"')
        WHERE gc_targets LIKE '%"projects"%'
        """
    )


def downgrade() -> None:
    op.execute(
        """
        UPDATE gc_log_entry
        SET gc_targets = REPLACE(gc_targets, '"aspects"', '"projects"')
        WHERE gc_targets LIKE '%"aspects"%'
        """
    )
    op.execute(
        """
        UPDATE stats_log_entry
        SET stats_targets = REPLACE(stats_targets, '"aspects"', '"projects"')
        WHERE stats_targets LIKE '%"aspects"%'
        """
    )
    op.execute(
        """
        UPDATE gen_log_entry
        SET gen_targets = REPLACE(gen_targets, '"aspects"', '"projects"')
        WHERE gen_targets LIKE '%"aspects"%'
        """
    )
