"""'Backfill life plan'

Revision ID: 52c69c4dd0ed
Revises: 7eec079687d5
Create Date: 2025-12-21 19:35:12.868635

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "52c69c4dd0ed"
down_revision = "7eec079687d5"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE workspace
        SET feature_flags = json_set(
            json_remove(feature_flags, '$.aspects'),
            '$.life-plan', json_extract(feature_flags, '$.aspects')
        )
        WHERE json_type(feature_flags, '$.aspects') IS NOT NULL
    """
    )


def downgrade() -> None:
    pass
