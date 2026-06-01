"""Search entity indexing map index method version.

Revision ID: b7c4d2e91a03
Revises: 22846a7f1925
Create Date: 2026-05-31 16:00:00.000000

"""

import sqlalchemy as sa
from alembic import op

revision = "b7c4d2e91a03"
down_revision = "22846a7f1925"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "search_entity_indexing_map",
        sa.Column("index_method_version", sa.Integer(), nullable=True),
    )
    op.execute(
        """
        UPDATE search_entity_indexing_map
        SET index_method_version = 1
        """
    )
    op.alter_column(
        "search_entity_indexing_map",
        "index_method_version",
        nullable=False,
    )


def downgrade() -> None:
    op.drop_column("search_entity_indexing_map", "index_method_version")
