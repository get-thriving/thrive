"""'Add new fields for chapter and goal'

Revision ID: fec9e643177f
Revises: f1a2b3c4d5e6
Create Date: 2025-12-27 16:25:36.750498

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fec9e643177f'
down_revision = 'f1a2b3c4d5e6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("inbox_task") as batch_op:
        batch_op.add_column(sa.Column("chapter_ref_id", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("goal_ref_id", sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            "fk_inbox_task_chapter_ref_id_chapter",
            "chapter",
            ["chapter_ref_id"],
            ["ref_id"],
        )
        batch_op.create_foreign_key(
            "fk_inbox_task_goal_ref_id_goal",
            "goal",
            ["goal_ref_id"],
            ["ref_id"],
        )

    with op.batch_alter_table("big_plan") as batch_op:
        batch_op.add_column(sa.Column("chapter_ref_id", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("goal_ref_id", sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            "fk_big_plan_chapter_ref_id_chapter",
            "chapter",
            ["chapter_ref_id"],
            ["ref_id"],
        )
        batch_op.create_foreign_key(
            "fk_big_plan_goal_ref_id_goal",
            "goal",
            ["goal_ref_id"],
            ["ref_id"],
        )

    with op.batch_alter_table("habit") as batch_op:
        batch_op.add_column(sa.Column("chapter_ref_id", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("goal_ref_id", sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            "fk_habit_chapter_ref_id_chapter",
            "chapter",
            ["chapter_ref_id"],
            ["ref_id"],
        )

        batch_op.create_foreign_key(
            "fk_habit_goal_ref_id_goal",
            "goal",
            ["goal_ref_id"],
            ["ref_id"],
        )


    with op.batch_alter_table("chore") as batch_op:
        batch_op.add_column(sa.Column("chapter_ref_id", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("goal_ref_id", sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            "fk_chore_chapter_ref_id_chapter",
            "chapter",
            ["chapter_ref_id"],
            ["ref_id"],
        )
        batch_op.create_foreign_key(
            "fk_chore_goal_ref_id_goal",
            "goal",
            ["goal_ref_id"],
            ["ref_id"],
        )


def downgrade() -> None:
    pass
