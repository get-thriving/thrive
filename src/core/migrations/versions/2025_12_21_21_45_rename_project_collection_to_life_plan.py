"""'Rename project collection to life plan'

Revision ID: 71395b916fd1
Revises: 52c69c4dd0ed
Create Date: 2025-12-21 21:45:33.656446

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "71395b916fd1"
down_revision = "52c69c4dd0ed"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.rename_table("project_collection", "life_plan")
    op.rename_table("project_collection_event", "life_plan_event")

    op.execute(
        """
    CREATE UNIQUE INDEX ix_life_plan_workspace_ref_id ON life_plan (workspace_ref_id)
    """
    )

    op.drop_index("ix_project_collection_workspace_ref_id")

    with op.batch_alter_table("project") as batch_op:
        batch_op.alter_column(
            "project_collection_ref_id", new_column_name="life_plan_ref_id"
        )


def downgrade() -> None:
    pass
