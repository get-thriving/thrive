"""'Fix missing journals'

Revision ID: 8af611e06a5d
Revises: 8f3a2c1d9b0e
Create Date: 2026-01-04 00:12:33.591870

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "8af611e06a5d"
down_revision = "8f3a2c1d9b0e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE workspace
        SET feature_flags = json_set(feature_flags, '$.journals', true)
        WHERE feature_flags->>'$.journals' is NULL;
        """
    )


def downgrade() -> None:
    pass
