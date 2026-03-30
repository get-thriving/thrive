"""'Remove activities too'

Revision ID: ef40aa3c0902
Revises: b3f7a2d91e05
Create Date: 2026-03-28 19:29:13.381571

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "ef40aa3c0902"
down_revision = "b3f7a2d91e05"
branch_labels = None
depends_on = None


def upgrade():
    # Remove time plan activity events associated with orphaned time plan activities targeting missing inbox-tasks.
    op.execute(
        """
        DELETE FROM time_plan_activity_event
        WHERE owner_ref_id IN (
            SELECT ref_id
            FROM time_plan_activity
            WHERE target = 'inbox-task'
              AND (target_ref_id IS NULL
                OR target_ref_id NOT IN (
                    SELECT ref_id FROM inbox_task
                ))
        )
        """
    )

    # Remove time plan activities that target inbox-tasks which do not exist.
    op.execute(
        """
        DELETE FROM time_plan_activity
        WHERE target = 'inbox-task'
          AND (target_ref_id IS NULL
            OR target_ref_id NOT IN (
                SELECT ref_id FROM inbox_task
            ))
        """
    )


def downgrade():
    pass
