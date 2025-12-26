"""'Add max age to life plan'

Revision ID: cda51dbea5ee
Revises: 9c5f1b3e2a77
Create Date: 2025-12-26 14:09:04.987419

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "cda51dbea5ee"
down_revision = "9c5f1b3e2a77"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("life_plan") as batch_op:
        batch_op.add_column(sa.Column("max_age", sa.Integer, nullable=True))

    op.execute(
        """
        UPDATE life_plan SET max_age = 100
        WHERE max_age IS NULL
        """
    )

    with op.batch_alter_table("life_plan") as batch_op:
        batch_op.alter_column("max_age", nullable=False)


def downgrade() -> None:
    pass
