"""backfill calendar additional timezones

Revision ID: 8cb0558e4c04
Revises: c9d1f4a6b273
Create Date: 2026-08-30 23:13:18.347693

feature/multiple-timezones was merged after buffers and note-aspects were
already on develop. The merge rewrote those later revisions to sit on top of
c9d1f4a72b60, so databases that had already reached c9d1f4a6b273 never ran the
original additional_timezones DDL. Re-apply it at head when the column is
missing.
"""

from alembic import op

revision = "8cb0558e4c04"
down_revision = "c9d1f4a6b273"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE schedule_domain
            ADD COLUMN IF NOT EXISTS additional_timezones JSON NOT NULL DEFAULT '[]'
        """
    )


def downgrade() -> None:
    pass
