"""Update person-birthday to person-occasion in journal_stats report field

This migration updates the journal_stats table's report JSON field to replace
occurrences of 'person-birthday' with 'person-occasion'.

Revision ID: 7b2e4f8a1c3d
Revises: f4a9c8b2d6e1
Create Date: 2026-01-11 12:00:00.000000

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "7b2e4f8a1c3d"
down_revision = "f4a9c8b2d6e1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE journal_stats
        SET report = REPLACE(report, 'person-birthday', 'person-occasion')
        """
    )


def downgrade() -> None:
    pass
