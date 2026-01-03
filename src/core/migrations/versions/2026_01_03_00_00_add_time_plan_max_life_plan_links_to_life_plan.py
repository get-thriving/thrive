"""Add time plan max life plan links to life plan.

Revision ID: 8f3a2c1d9b0e
Revises: 541adf2ff087
Create Date: 2026-01-03 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "8f3a2c1d9b0e"
down_revision = "541adf2ff087"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("life_plan") as batch_op:
        batch_op.add_column(
            sa.Column("time_plan_max_life_plan_links", sa.Integer, nullable=True)
        )

    op.execute(
        """
        UPDATE life_plan
        SET time_plan_max_life_plan_links = 3
        WHERE time_plan_max_life_plan_links IS NULL
        """
    )

    with op.batch_alter_table("life_plan") as batch_op:
        batch_op.alter_column("time_plan_max_life_plan_links", nullable=False)


def downgrade() -> None:
    pass
