"""'Backfill user to todo'

Revision ID: 3144d0650804
Revises: 16fdcdd66f85
Create Date: 2026-03-20 21:28:03.194175

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3144d0650804'
down_revision = '16fdcdd66f85'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE inbox_task
        SET source = 'todo'
        WHERE source = 'user'
        """
    )


def downgrade() -> None:
    pass
