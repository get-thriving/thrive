"""user verified field

Revision ID: dbcc639f25d1
Revises: 7639d48204a7
Create Date: 2026-06-02 23:00:25.999151

"""

import sqlalchemy as sa
from alembic import op

revision = "dbcc639f25d1"
down_revision = "7639d48204a7"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("user") as batch_op:
        batch_op.add_column(
            sa.Column(
                "verified",
                sa.Boolean(),
                nullable=False,
                server_default=sa.false(),
            )
        )
    op.execute('UPDATE "user" SET verified = 1')


def downgrade() -> None:
    with op.batch_alter_table("user") as batch_op:
        batch_op.drop_column("verified")
