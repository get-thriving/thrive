"""'Fix some data issues between big plans and inbox tasks'

Revision ID: 541adf2ff087
Revises: c1d2e3f4a5b6
Create Date: 2025-12-31 17:36:26.756447

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "541adf2ff087"
down_revision = "c1d2e3f4a5b6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE
            inbox_task
        SET project_ref_id = (
            SELECT big_plan.project_ref_id
            FROM big_plan
            WHERE big_plan.ref_id = inbox_task.source_entity_ref_id
        )
        WHERE source = 'big-plan'
        AND EXISTS (
            SELECT 1 FROM big_plan WHERE big_plan.ref_id = inbox_task.source_entity_ref_id
        )
    """
    )

    op.execute(
        """
        UPDATE
            inbox_task
        SET project_ref_id = (
            SELECT chore.project_ref_id
            FROM chore
            WHERE chore.ref_id = inbox_task.source_entity_ref_id
        )
        WHERE source = 'chore'
        AND EXISTS (
            SELECT 1 FROM chore WHERE chore.ref_id = inbox_task.source_entity_ref_id
        )
    """
    )
    op.execute(
        """
        UPDATE
            inbox_task
        SET project_ref_id = (
            SELECT habit.project_ref_id
            FROM habit
            WHERE habit.ref_id = inbox_task.source_entity_ref_id
        )
        WHERE source = 'habit'
        AND EXISTS (
            SELECT 1 FROM habit WHERE habit.ref_id = inbox_task.source_entity_ref_id
        )
    """
    )


def downgrade() -> None:
    pass
