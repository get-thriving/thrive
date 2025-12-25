"""'Fix life plan feature values'

Revision ID: 43195d274a18
Revises: d742acda64d2
Create Date: 2025-12-25 09:43:40.547294

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "43195d274a18"
down_revision = "d742acda64d2"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE workspace
        SET feature_flags = json_set(
            feature_flags,
            '$.life-plan', True
        )
    """
    )
    op.execute(
        """
        UPDATE workspace
        SET feature_flags = json_set(
            feature_flags,
            '$.working-mem', True
        )
    """
    )
    op.execute(
        """
        UPDATE workspace
        SET feature_flags = json_set(
            feature_flags,
            '$.time-plans', True
        )
    """
    )
    op.execute(
        """
        UPDATE workspace
        SET feature_flags = json_set(
            feature_flags,
            '$.schedule', True
        )
    """
    )


def downgrade() -> None:
    pass
