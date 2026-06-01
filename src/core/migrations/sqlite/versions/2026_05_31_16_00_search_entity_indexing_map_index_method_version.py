"""Search entity indexing map index method version.

Revision ID: b7c4d2e91a03
Revises: 22846a7f1925
Create Date: 2026-05-31 16:00:00.000000

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy import text

revision = "b7c4d2e91a03"
down_revision = "22846a7f1925"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()

    with op.batch_alter_table("search_entity_indexing_map") as batch_op:
        batch_op.add_column(
            sa.Column("index_method_version", sa.Integer(), nullable=True)
        )

    conn.execute(
        text(
            """
            UPDATE search_entity_indexing_map
            SET index_method_version = 1
            """
        )
    )

    with op.batch_alter_table("search_entity_indexing_map") as batch_op:
        batch_op.alter_column("index_method_version", nullable=False)


def downgrade() -> None:
    with op.batch_alter_table("search_entity_indexing_map") as batch_op:
        batch_op.drop_column("index_method_version")
