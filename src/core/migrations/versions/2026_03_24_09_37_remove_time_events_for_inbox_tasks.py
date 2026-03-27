"""'Remove time events for inbox tasks'

Revision ID: 6ceb5803cd4f
Revises: eee946a4d4e1
Create Date: 2026-03-24 09:37:19.975626

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "6ceb5803cd4f"
down_revision = "eee946a4d4e1"
branch_labels = None
depends_on = None


def upgrade():
    op.execute(
        """
        DELETE FROM time_event_in_day_block_event
        WHERE owner_ref_id IN (
            SELECT ref_id
            FROM time_event_in_day_block
            WHERE namespace = 'inbox-task'
        )
        """
    )
    op.execute(
        """
        DELETE FROM time_event_in_day_block
        WHERE namespace = 'inbox-task'
        """
    )

    op.execute(
        """
        DELETE FROM time_event_full_days_block_event
        WHERE owner_ref_id IN (
            SELECT ref_id
            FROM time_event_full_days_block
            WHERE namespace = 'inbox-task'
        )
        """
    )
    op.execute(
        """
        DELETE FROM time_event_full_days_block
        WHERE namespace = 'inbox-task'
        """
    )


def downgrade():
    # Data removal is irreversible.
    pass
