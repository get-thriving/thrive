"""'Replace not-started-gen with not-started for inbox tasks'

Revision ID: eee946a4d4e1
Revises: 50d9f0ce54f9
Create Date: 2026-03-22 16:54:15.197857

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "eee946a4d4e1"
down_revision = "50d9f0ce54f9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE inbox_task
        SET status = 'not-started'
        WHERE status = 'not-started-gen';
        """
    )
    op.execute(
        """
        UPDATE habit_streak_marks
        SET statuses = REPLACE(statuses, '"not-started-gen"', '"not-started"')
        WHERE statuses LIKE '%not-started-gen%';
        """
    )
    op.execute(
        """
        UPDATE journal_stats
        SET report = REPLACE(report, '"not-started-gen"', '"not-started"')
        WHERE report LIKE '%not-started-gen%';
        """
    )


def downgrade() -> None:
    pass
