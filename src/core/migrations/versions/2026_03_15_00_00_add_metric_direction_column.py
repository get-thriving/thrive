"""Add metric_direction column to metric table.

Revision ID: a1b2c3d4e5f6
Revises: 9f8e7d6c5b4a
Create Date: 2026-03-15 00:00:00.000000

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "a1b2c3d4e5f6"
down_revision = "9f8e7d6c5b4a"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("metric") as batch_op:
        batch_op.add_column(
            sa.Column("metric_direction", sa.String(), nullable=True)
        )

    op.execute("UPDATE metric SET metric_direction = 'none' WHERE metric_direction IS NULL")

    with op.batch_alter_table("metric") as batch_op:
        batch_op.alter_column("metric_direction", nullable=False)


def downgrade() -> None:
    pass
