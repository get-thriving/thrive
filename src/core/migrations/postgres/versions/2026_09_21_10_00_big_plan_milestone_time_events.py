"""big plan milestone time events

Revision ID: d9e0f1a2b3c4
Revises: c8d9e0f1a2b3
Create Date: 2026-09-21 10:00:00.000000

Every big plan milestone now owns a full-days time event block, so it shows
up on the calendar. Milestones created before this had none, and the generic
archiver raises on a missing OwnsOne, so give every existing one a block -
archived milestones included, mirroring their archival state.
"""

from alembic import op

revision = "d9e0f1a2b3c4"
down_revision = "c8d9e0f1a2b3"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        INSERT INTO time_event_full_days_block (
            version,
            archived,
            created_time,
            last_modified_time,
            archived_time,
            archival_reason,
            time_event_domain_ref_id,
            name,
            owner,
            start_date,
            duration_days,
            end_date
        )
        SELECT
            1,
            bpm.archived,
            bpm.created_time,
            bpm.last_modified_time,
            bpm.archived_time,
            bpm.archival_reason,
            ted.ref_id,
            'NOT-USED',
            'BigPlanMilestone:std:' || bpm.ref_id,
            bpm.date,
            1,
            bpm.date + 1
        FROM big_plan_milestone AS bpm
        JOIN big_plan AS bp ON bp.ref_id = bpm.big_plan_ref_id
        JOIN big_plan_collection AS bpc
            ON bpc.ref_id = bp.big_plan_collection_ref_id
        JOIN time_event_domain AS ted
            ON ted.workspace_ref_id = bpc.workspace_ref_id
        WHERE NOT EXISTS (
            SELECT 1
            FROM time_event_full_days_block AS tefdb
            WHERE tefdb.owner = 'BigPlanMilestone:std:' || bpm.ref_id
        )
    """
    )


def downgrade() -> None:
    op.execute(
        """
        DELETE FROM time_event_full_days_block
        WHERE owner LIKE 'BigPlanMilestone:std:%'
    """
    )
