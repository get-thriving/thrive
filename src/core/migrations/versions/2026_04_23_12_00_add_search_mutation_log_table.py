"""'add search mutation log table'

Revision ID: c3d4e5f6a7b8
Revises: 216008d208e6
Create Date: 2026-04-23 12:00:00.000000

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "c3d4e5f6a7b8"
down_revision = "216008d208e6"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "search_mutation_log",
        sa.Column("mutation_id", sa.String(), nullable=False),
        sa.Column("workspace_ref_id", sa.Integer(), nullable=False),
        sa.Column("created_time", sa.DateTime(), nullable=False),
        sa.Column("last_modified_time", sa.DateTime(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(
            ["workspace_ref_id"],
            ["workspace.ref_id"],
            name="fk_search_mutation_log_workspace_ref_id",
        ),
        sa.PrimaryKeyConstraint(
            "mutation_id", name="pk_search_mutation_log_mutation_id"
        ),
    )
    op.create_index(
        "ix_search_mutation_log_status",
        "search_mutation_log",
        ["status"],
        unique=False,
    )


def downgrade():
    op.drop_index(
        "ix_search_mutation_log_status",
        table_name="search_mutation_log",
    )
    op.drop_table("search_mutation_log")
