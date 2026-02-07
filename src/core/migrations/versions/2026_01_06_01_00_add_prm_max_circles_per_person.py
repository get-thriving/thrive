"""Add PRM max_circles_per_person.

Revision ID: 3c8a2d5b7f10
Revises: 1e9d0f7b3c11
Create Date: 2026-01-06 01:00:00.000000
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = "3c8a2d5b7f10"
down_revision = "1e9d0f7b3c11"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("prm") as batch_op:
        batch_op.add_column(
            sa.Column(
                "max_circles_per_person",
                sa.Integer(),
                nullable=True,
            )
        )

    op.execute("UPDATE prm SET max_circles_per_person = 3")

    with op.batch_alter_table("prm") as batch_op:
        batch_op.alter_column("max_circles_per_person", nullable=False)


def downgrade() -> None:
    pass
