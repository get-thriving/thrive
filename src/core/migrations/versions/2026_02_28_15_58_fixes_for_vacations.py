"""'Fixes for vacations'

Revision ID: fae49c835e4e
Revises: 401d1beb0142
Create Date: 2026-02-28 15:58:23.659968

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fae49c835e4e'
down_revision = '401d1beb0142'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        sa.text(
            """
            UPDATE time_event_full_days_block
            SET
                start_date = substr(start_date, 1, 10),
                end_date = substr(end_date, 1, 10)
            WHERE namespace = 'vacation'
            """
        )
    )


def downgrade():
    pass
