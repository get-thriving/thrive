"""calendar additional timezones

Revision ID: c9d1f4a72b60
Revises: b7c4e5f2a318
Create Date: 2026-08-30 10:00:00.000000

"""

from alembic import op

revision = "c9d1f4a72b60"
down_revision = "b7c4e5f2a318"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE schedule_domain
            ADD COLUMN additional_timezones JSONB NOT NULL DEFAULT '[]'::jsonb
        """
    )


def downgrade() -> None:
    op.execute("ALTER TABLE schedule_domain DROP COLUMN additional_timezones")
