"""Backfill children for aspects -- redux

Revision ID: 97aa6c5f0c4b
Revises: 8fa2fbaa9924
Create Date: 2024-03-24 17:51:49.835684

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "97aa6c5f0c4b"
down_revision = "8fa2fbaa9924"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """update aspect set order_of_child_aspects='[]' where order_of_child_aspects is null"""
    )


def downgrade() -> None:
    pass
