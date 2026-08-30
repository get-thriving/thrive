"""note aspects and goals

Revision ID: c9d1f4a6b273
Revises: c8d5f6a3b429
Create Date: 2026-08-30 13:00:00.000000

"""

from alembic import op

revision = "c9d1f4a6b273"
down_revision = "c8d5f6a3b429"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE journal_collection
            ADD COLUMN include_aspects_in_note BOOLEAN NOT NULL DEFAULT false,
            ADD COLUMN include_goals_in_note BOOLEAN NOT NULL DEFAULT false
        """
    )
    op.execute(
        """
        ALTER TABLE time_plan_domain
            ADD COLUMN include_aspects_in_note BOOLEAN NOT NULL DEFAULT false,
            ADD COLUMN include_goals_in_note BOOLEAN NOT NULL DEFAULT false
        """
    )


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE journal_collection
            DROP COLUMN include_goals_in_note,
            DROP COLUMN include_aspects_in_note
        """
    )
    op.execute(
        """
        ALTER TABLE time_plan_domain
            DROP COLUMN include_goals_in_note,
            DROP COLUMN include_aspects_in_note
        """
    )
