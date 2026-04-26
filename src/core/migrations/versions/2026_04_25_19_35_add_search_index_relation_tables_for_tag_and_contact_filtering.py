"""Add normalized search-index relation tables for tag/contact filtering.

Revision ID: f1a2b3c4d5e6
Revises: e4f7a9c1d2b3
Create Date: 2026-04-25 19:35:00.000000

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = "deadbeefdead"
down_revision = "42fc79adebb8"
branch_labels = None
depends_on = None


def _has_table(table_name: str) -> bool:
    inspector = inspect(op.get_bind())
    return table_name in inspector.get_table_names()


def upgrade() -> None:
    if not _has_table("search_index_tag"):
        op.create_table(
            "search_index_tag",
            sa.Column(
                "workspace_ref_id", sa.Integer(), nullable=False, primary_key=True
            ),
            sa.Column("entity_tag", sa.String(), nullable=False, primary_key=True),
            sa.Column("entity_ref_id", sa.Integer(), nullable=False, primary_key=True),
            sa.Column("tag_ref_id", sa.Integer(), nullable=False, primary_key=True),
        )

    if not _has_table("search_index_contact"):
        op.create_table(
            "search_index_contact",
            sa.Column(
                "workspace_ref_id", sa.Integer(), nullable=False, primary_key=True
            ),
            sa.Column("entity_tag", sa.String(), nullable=False, primary_key=True),
            sa.Column("entity_ref_id", sa.Integer(), nullable=False, primary_key=True),
            sa.Column("contact_ref_id", sa.Integer(), nullable=False, primary_key=True),
        )


def downgrade() -> None:
    if _has_table("search_index_contact"):
        op.drop_table("search_index_contact")

    if _has_table("search_index_tag"):
        op.drop_table("search_index_tag")
