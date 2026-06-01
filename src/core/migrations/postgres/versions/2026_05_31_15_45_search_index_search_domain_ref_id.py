"""Search index search domain ref id.

Revision ID: 22846a7f1925
Revises: 3ce25ef103a3
Create Date: 2026-05-31 15:45:23.478100

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy import text

revision = "22846a7f1925"
down_revision = "3ce25ef103a3"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()

    op.add_column(
        "search_index",
        sa.Column("search_domain_ref_id", sa.Integer(), nullable=True),
    )
    conn.execute(
        text(
            """
            UPDATE search_index
            SET search_domain_ref_id = (
                SELECT search_domain.ref_id
                FROM search_domain
                WHERE search_domain.workspace_ref_id = search_index.workspace_ref_id
            )
            """
        )
    )
    op.alter_column("search_index", "search_domain_ref_id", nullable=False)
    op.create_foreign_key(
        "fk_search_index_search_domain_ref_id",
        "search_index",
        "search_domain",
        ["search_domain_ref_id"],
        ["ref_id"],
    )

    op.add_column(
        "search_index_tag",
        sa.Column("search_domain_ref_id", sa.Integer(), nullable=True),
    )
    conn.execute(
        text(
            """
            UPDATE search_index_tag
            SET search_domain_ref_id = (
                SELECT search_domain.ref_id
                FROM search_domain
                WHERE search_domain.workspace_ref_id = search_index_tag.workspace_ref_id
            )
            """
        )
    )
    op.alter_column("search_index_tag", "search_domain_ref_id", nullable=False)
    op.create_foreign_key(
        "fk_search_index_tag_search_domain_ref_id",
        "search_index_tag",
        "search_domain",
        ["search_domain_ref_id"],
        ["ref_id"],
    )

    op.add_column(
        "search_index_contact",
        sa.Column("search_domain_ref_id", sa.Integer(), nullable=True),
    )
    conn.execute(
        text(
            """
            UPDATE search_index_contact
            SET search_domain_ref_id = (
                SELECT search_domain.ref_id
                FROM search_domain
                WHERE search_domain.workspace_ref_id
                    = search_index_contact.workspace_ref_id
            )
            """
        )
    )
    op.alter_column("search_index_contact", "search_domain_ref_id", nullable=False)
    op.create_foreign_key(
        "fk_search_index_contact_search_domain_ref_id",
        "search_index_contact",
        "search_domain",
        ["search_domain_ref_id"],
        ["ref_id"],
    )


def downgrade() -> None:
    op.drop_constraint(
        "fk_search_index_contact_search_domain_ref_id",
        "search_index_contact",
        type_="foreignkey",
    )
    op.drop_column("search_index_contact", "search_domain_ref_id")

    op.drop_constraint(
        "fk_search_index_tag_search_domain_ref_id",
        "search_index_tag",
        type_="foreignkey",
    )
    op.drop_column("search_index_tag", "search_domain_ref_id")

    op.drop_constraint(
        "fk_search_index_search_domain_ref_id",
        "search_index",
        type_="foreignkey",
    )
    op.drop_column("search_index", "search_domain_ref_id")
