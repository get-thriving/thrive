"""'Fix some things for working mem'

Revision ID: bbc1bab20658
Revises: d3391e789c2a
Create Date: 2026-01-24 17:09:38.820273

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "bbc1bab20658"
down_revision = "d3391e789c2a"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("working_mem") as batch_op:
        batch_op.drop_column("name")

    op.execute(
        """
        DROP INDEX IF EXISTS ix_working_mem_working_mem_collection_ref_id
        """
    )
    op.execute(
        """
        DROP INDEX IF EXISTS ix_working_mem_working_mem_collection_ref_id_singleton
        """
    )
    op.execute(
        """
        CREATE UNIQUE INDEX ix_working_mem_working_mem_collection_ref_id ON working_mem (working_mem_collection_ref_id)
        """
    )


def downgrade() -> None:
    pass
