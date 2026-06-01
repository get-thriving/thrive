"""Add verified column to user table.

Revision ID: a1b2c3d4e5f6
Revises: 7639d48204a7
Create Date: 2026-06-01 00:00:00.000000

"""

from alembic import op

revision = "a1b2c3d4e5f6"
down_revision = "7639d48204a7"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE "user"
        ADD COLUMN verified BOOLEAN NOT NULL DEFAULT TRUE
    """
    )


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE "user"
        DROP COLUMN verified
    """
    )
