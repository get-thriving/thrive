"""location is key

Revision ID: 102813a5499d
Revises: c3d4e5f6a7b8
Create Date: 2026-09-02 07:44:19.658631

"""

import sqlalchemy as sa
from alembic import op

revision = "102813a5499d"
down_revision = "c3d4e5f6a7b8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("location") as batch_op:
        batch_op.add_column(
            sa.Column(
                "is_key",
                sa.Boolean(),
                nullable=False,
                server_default=sa.false(),
            )
        )


def downgrade() -> None:
    with op.batch_alter_table("location") as batch_op:
        batch_op.drop_column("is_key")
