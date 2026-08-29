"""big plan dependencies

Revision ID: b7c4e5f2a318
Revises: a4b2c8d1e059
Create Date: 2026-08-28 10:00:00.000000

"""

import sqlalchemy as sa
from alembic import op

revision = "b7c4e5f2a318"
down_revision = "a4b2c8d1e059"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("big_plan") as batch_op:
        batch_op.add_column(
            sa.Column(
                "dependency_ref_ids",
                sa.JSON(),
                nullable=False,
                server_default="[]",
            )
        )


def downgrade() -> None:
    with op.batch_alter_table("big_plan") as batch_op:
        batch_op.drop_column("dependency_ref_ids")
