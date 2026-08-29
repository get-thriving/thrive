"""project dependencies

Revision ID: b7c4e5f2a318
Revises: a4b2c8d1e059
Create Date: 2026-08-28 10:00:00.000000

"""

from alembic import op

revision = "b7c4e5f2a318"
down_revision = "a4b2c8d1e059"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE project
            ADD COLUMN dependency_ref_ids JSONB NOT NULL DEFAULT '[]'::jsonb
        """
    )


def downgrade() -> None:
    op.execute("ALTER TABLE project DROP COLUMN dependency_ref_ids")
