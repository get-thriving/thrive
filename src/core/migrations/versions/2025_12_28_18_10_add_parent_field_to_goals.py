"""Add parent field to goals.

Revision ID: b7c8d9e0f1a2
Revises: a6b7c8d9e0f1
Create Date: 2025-12-28 18:10:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "b7c8d9e0f1a2"
down_revision = "a6b7c8d9e0f1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    naming_convention = {
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
    with op.batch_alter_table("goal", naming_convention=naming_convention) as batch_op:
        batch_op.add_column(sa.Column("parent_goal_ref_id", sa.Integer, nullable=True))
        batch_op.create_foreign_key(
            "fk_goal_parent_goal_ref_id_goal",
            "goal",
            ["parent_goal_ref_id"],
            ["ref_id"],
        )
    op.execute(
        """
        CREATE INDEX ix_goal_parent_goal_ref_id ON goal (parent_goal_ref_id) WHERE parent_goal_ref_id IS NOT NULL;"""
    )


def downgrade() -> None:
    pass
