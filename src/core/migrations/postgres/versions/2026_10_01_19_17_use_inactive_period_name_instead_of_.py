"""Use inactive period name instead of reason

Revision ID: a4421dd1fd86
Revises: 6945a5af9aa9
Create Date: 2026-10-01 19:17:31.034279

"""

import sqlalchemy as sa
from alembic import op

revision = "a4421dd1fd86"
down_revision = "6945a5af9aa9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE habit_streak_inactive_period
        SET name = substr(trim(reason), 1, 100)
        WHERE reason IS NOT NULL AND trim(reason) <> ''
        """
    )
    op.drop_column("habit_streak_inactive_period", "reason")


def downgrade() -> None:
    op.add_column(
        "habit_streak_inactive_period",
        sa.Column("reason", sa.String(), nullable=True),
    )
    op.execute(
        """
        UPDATE habit_streak_inactive_period
        SET reason = name
        """
    )
