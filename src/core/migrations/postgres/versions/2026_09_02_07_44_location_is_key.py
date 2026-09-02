"""location is key

Revision ID: 102813a5499d
Revises: c3d4e5f6a7b8
Create Date: 2026-09-02 07:44:19.658631

"""

from alembic import op

revision = "102813a5499d"
down_revision = "c3d4e5f6a7b8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TABLE location ADD COLUMN is_key BOOLEAN NOT NULL DEFAULT false")


def downgrade() -> None:
    op.execute("ALTER TABLE location DROP COLUMN is_key")
