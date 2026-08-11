"""inbox task owner index

Revision ID: d70d07199f1d
Revises: 59b73a997ea0
Create Date: 2026-08-11 16:30:00.000000

"""

from alembic import op

revision = "d70d07199f1d"
down_revision = "59b73a997ea0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE INDEX ix_inbox_task_owner ON inbox_task (owner)
    """
    )


def downgrade() -> None:
    op.execute("DROP INDEX ix_inbox_task_owner")
