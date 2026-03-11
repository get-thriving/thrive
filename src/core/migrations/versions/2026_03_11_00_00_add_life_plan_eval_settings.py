"""'Add life plan eval settings fields'

Revision ID: abcabcabcabc
Revises: a1b2c3d4e5f6
Create Date: 2026-03-11 00:00:00.000000

"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "abcabcabcabc"
down_revision = "a1b2c3d4e5f6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("life_plan") as batch_op:
        batch_op.add_column(sa.Column("eval_periods", sa.String, nullable=True))
        batch_op.add_column(sa.Column("eval_approach", sa.String, nullable=True))
        batch_op.add_column(sa.Column("eval_task_gen_params", sa.String, nullable=True))
        batch_op.add_column(
            sa.Column("eval_task_generation_in_advance_days", sa.String, nullable=True)
        )

    op.execute(
        """
        UPDATE life_plan
        SET eval_periods = '[]',
            eval_approach = 'none',
            eval_task_gen_params = NULL,
            eval_task_generation_in_advance_days = '{}'
        WHERE eval_periods IS NULL
        """
    )

    with op.batch_alter_table("life_plan") as batch_op:
        batch_op.alter_column("eval_periods", nullable=False)
        batch_op.alter_column("eval_approach", nullable=False)
        batch_op.alter_column("eval_task_generation_in_advance_days", nullable=False)


def downgrade() -> None:
    with op.batch_alter_table("life_plan") as batch_op:
        batch_op.drop_column("eval_periods")
        batch_op.drop_column("eval_approach")
        batch_op.drop_column("eval_task_gen_params")
        batch_op.drop_column("eval_task_generation_in_advance_days")
