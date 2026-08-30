"""time event in day block buffers

Revision ID: c8d5f6a3b429
Revises: b7c4e5f2a318
Create Date: 2026-08-30 12:00:00.000000

"""

import sqlalchemy as sa
from alembic import op

revision = "c8d5f6a3b429"
down_revision = "b7c4e5f2a318"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("time_event_in_day_block") as batch_op:
        batch_op.add_column(
            sa.Column("buffer_before_mins", sa.Integer(), nullable=True)
        )
        batch_op.add_column(sa.Column("buffer_after_mins", sa.Integer(), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table("time_event_in_day_block") as batch_op:
        batch_op.drop_column("buffer_after_mins")
        batch_op.drop_column("buffer_before_mins")
