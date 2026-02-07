"""'Rename person_collection'

Revision ID: 347d4359d56b
Revises: c1a3d2b4e5f6
Create Date: 2026-01-06 00:15:38.724981

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "347d4359d56b"
down_revision = "c1a3d2b4e5f6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.rename_table("person_collection", "prm")
    op.rename_table("person_collection_event", "prm_event")
    op.execute(
        """
        CREATE UNIQUE INDEX ix_prm_workspace_ref_id ON prm (workspace_ref_id)
        """
    )
    op.drop_index("ix_person_collection_workspace_ref_id")

    with op.batch_alter_table("person") as batch_op:
        batch_op.alter_column("person_collection_ref_id", new_column_name="prm_ref_id")
    op.execute(
        """
        CREATE INDEX ix_person_prm_ref_id ON person (prm_ref_id)
        """
    )
    op.drop_index("ix_person_person_collection_ref_id")

    with op.batch_alter_table("circle") as batch_op:
        batch_op.alter_column("person_collection_ref_id", new_column_name="prm_ref_id")
    op.execute(
        """
        CREATE INDEX ix_circle_prm_ref_id ON circle (prm_ref_id)
        """
    )
    op.drop_index("ix_circle_person_collection_ref_id")


def downgrade() -> None:
    pass
