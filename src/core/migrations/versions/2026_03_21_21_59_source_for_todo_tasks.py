"""'Source for todo tasks'

Revision ID: 50d9f0ce54f9
Revises: 3b8613010fee
Create Date: 2026-03-21 21:59:15.760790

"""
from alembic import op


# revision identifiers, used by Alembic.
revision = '50d9f0ce54f9'
down_revision = '3b8613010fee'
branch_labels = None
depends_on = None


def upgrade():
    op.execute(
        """
        UPDATE inbox_task
        SET source = 'todo-task'
        WHERE source = 'todo'
        """
    )


def downgrade():
    pass
