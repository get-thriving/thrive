"""time event in day block buffers

Revision ID: c8d5f6a3b429
Revises: b7c4e5f2a318
Create Date: 2026-08-30 12:00:00.000000

"""

from alembic import op

revision = "c8d5f6a3b429"
down_revision = "b7c4e5f2a318"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE time_event_in_day_block
            ADD COLUMN buffer_before_mins INTEGER,
            ADD COLUMN buffer_after_mins INTEGER
        """
    )


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE time_event_in_day_block
            DROP COLUMN buffer_after_mins,
            DROP COLUMN buffer_before_mins
        """
    )
