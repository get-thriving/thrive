"""'Add birthday and birthday year fields'

Revision ID: cd1631847530
Revises: 71395b916fd1
Create Date: 2025-12-22 22:25:45.492195

"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "cd1631847530"
down_revision = "71395b916fd1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("life_plan") as batch_op:
        batch_op.add_column(sa.Column("birthday", sa.String, nullable=True))
        batch_op.add_column(sa.Column("birth_year", sa.Integer, nullable=True))

    op.execute(
        """
        UPDATE life_plan SET birthday = '18 Sep', birth_year = 1987
        WHERE birthday IS NULL OR birth_year IS NULL
        """
    )

    with op.batch_alter_table("life_plan") as batch_op:
        batch_op.alter_column("birthday", nullable=False)
        batch_op.alter_column("birth_year", nullable=False)


def downgrade() -> None:
    with op.batch_alter_table("life_plan") as batch_op:
        batch_op.drop_column("birthday")
        batch_op.drop_column("birth_year")
