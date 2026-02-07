"""Drop person.relationship column.

Revision ID: 1e9d0f7b3c11
Revises: 7b0d3a1c9f42
Create Date: 2026-01-06 00:50:00.000000
"""

from __future__ import annotations

from alembic import op


# revision identifiers, used by Alembic.
revision = "1e9d0f7b3c11"
down_revision = "7b0d3a1c9f42"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("person") as batch_op:
        batch_op.drop_column("relationship")


def downgrade() -> None:
    pass
