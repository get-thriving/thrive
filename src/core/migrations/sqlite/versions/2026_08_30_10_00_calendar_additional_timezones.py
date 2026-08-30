"""calendar additional timezones

Revision ID: c9d1f4a72b60
Revises: b7c4e5f2a318
Create Date: 2026-08-30 10:00:00.000000

"""

import sqlalchemy as sa
from alembic import op

revision = "c9d1f4a72b60"
down_revision = "b7c4e5f2a318"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("schedule_domain") as batch_op:
        batch_op.add_column(
            sa.Column(
                "additional_timezones",
                sa.JSON(),
                nullable=False,
                server_default="[]",
            )
        )


def downgrade() -> None:
    with op.batch_alter_table("schedule_domain") as batch_op:
        batch_op.drop_column("additional_timezones")
