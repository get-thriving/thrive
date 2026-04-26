"""'add search entity indexing map table'

Revision ID: 216008d208e6
Revises: b8e2f4a6c0d1
Create Date: 2026-04-21 22:04:47.746657

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "216008d208e6"
down_revision = "b8e2f4a6c0d1"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "search_entity_indexing_map",
        sa.Column("workspace_ref_id", sa.Integer(), nullable=False),
        sa.Column("entity_type", sa.String(), nullable=False),
        sa.Column("entity_ref_id", sa.Integer(), nullable=False),
        sa.Column("created_time", sa.DateTime(), nullable=False),
        sa.Column("last_modified_time", sa.DateTime(), nullable=False),
        sa.Column("object_id", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(
            ["workspace_ref_id"],
            ["workspace.ref_id"],
            name="fk_search_entity_indexing_map_workspace_ref_id",
        ),
        sa.UniqueConstraint(
            "workspace_ref_id",
            "entity_type",
            "entity_ref_id",
            name="uq_search_entity_indexing_map_workspace_entity",
        ),
    )
    op.create_index(
        "ix_search_entity_indexing_map_workspace_entity_type",
        "search_entity_indexing_map",
        ["workspace_ref_id", "entity_type"],
        unique=False,
    )


def downgrade():
    op.drop_index(
        "ix_search_entity_indexing_map_workspace_entity_type",
        table_name="search_entity_indexing_map",
    )
    op.drop_table("search_entity_indexing_map")
