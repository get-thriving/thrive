"""time event block start date index

Revision ID: 187710f87f90
Revises: a2599768b387
Create Date: 2026-08-11 19:00:00.000000

"""

from alembic import op

revision = "187710f87f90"
down_revision = "a2599768b387"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # The calendar's shared-schedule-event merge now looks up blocks by date
    # across every time event domain, so it needs date indexes that are not
    # rooted at time_event_domain_ref_id (the existing ones all are).
    op.execute(
        """
        CREATE INDEX ix_time_event_in_day_block_start_date
            ON time_event_in_day_block (start_date)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_time_event_full_days_block_start_date
            ON time_event_full_days_block (start_date)
    """
    )

    # The full-days overlap test also matches on end_date, so that leg of the
    # OR needs its own index to avoid falling back to a scan.
    op.execute(
        """
        CREATE INDEX ix_time_event_full_days_block_end_date
            ON time_event_full_days_block (end_date)
    """
    )


def downgrade() -> None:
    op.execute("DROP INDEX ix_time_event_full_days_block_end_date")
    op.execute("DROP INDEX ix_time_event_full_days_block_start_date")
    op.execute("DROP INDEX ix_time_event_in_day_block_start_date")
