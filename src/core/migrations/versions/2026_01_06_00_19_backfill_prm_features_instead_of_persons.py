"""'Backfill prm features instead of persons'

Revision ID: f84e8751883f
Revises: 347d4359d56b
Create Date: 2026-01-06 00:19:49.705491

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "f84e8751883f"
down_revision = "347d4359d56b"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE workspace
        SET feature_flags = json_set(feature_flags, '$.prm', json_extract(feature_flags, '$.persons'))
        WHERE feature_flags->>'$.prm' is NULL;
        """
    )
    op.execute(
        """
        UPDATE workspace
        SET feature_flags = json_remove(feature_flags, '$.persons')
        """
    )


def downgrade() -> None:
    pass
