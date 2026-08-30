"""note aspects and goals

Revision ID: c9d1f4a6b273
Revises: c8d5f6a3b429
Create Date: 2026-08-30 13:00:00.000000

"""

import sqlalchemy as sa
from alembic import op

revision = "c9d1f4a6b273"
down_revision = "c8d5f6a3b429"
branch_labels = None
depends_on = None

_TABLES = ("journal_collection", "time_plan_domain")


def upgrade() -> None:
    for table_name in _TABLES:
        with op.batch_alter_table(table_name) as batch_op:
            batch_op.add_column(
                sa.Column(
                    "include_aspects_in_note",
                    sa.Boolean(),
                    nullable=False,
                    server_default=sa.false(),
                )
            )
            batch_op.add_column(
                sa.Column(
                    "include_goals_in_note",
                    sa.Boolean(),
                    nullable=False,
                    server_default=sa.false(),
                )
            )


def downgrade() -> None:
    for table_name in _TABLES:
        with op.batch_alter_table(table_name) as batch_op:
            batch_op.drop_column("include_goals_in_note")
            batch_op.drop_column("include_aspects_in_note")
