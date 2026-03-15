"""'The new columns for metric direction'

Revision ID: a15f6c2368ff
Revises: 9b3c2d4e5f6a
Create Date: 2026-03-15 18:23:16.392076

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "a15f6c2368ff"
down_revision = "9b3c2d4e5f6a"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("metric") as batch_op:
        batch_op.add_column(sa.Column("metric_direction", sa.String(), nullable=True))

    op.execute(
        "UPDATE metric SET metric_direction = 'none' WHERE metric_direction IS NULL"
    )

    with op.batch_alter_table("metric") as batch_op:
        batch_op.alter_column("metric_direction", nullable=False)


def downgrade() -> None:
    pass
