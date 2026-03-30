"""'Remove orphaned tasks'

Revision ID: b3f7a2d91e05
Revises: c59ea1b1c62c
Create Date: 2026-03-28 00:00:00.000000

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "b3f7a2d91e05"
down_revision = "c59ea1b1c62c"
branch_labels = None
depends_on = None


def upgrade():
    # Remove inbox task events for inbox tasks with no source_entity_ref_id.
    op.execute(
        """
        DELETE FROM inbox_task_event
        WHERE owner_ref_id IN (
            SELECT ref_id
            FROM inbox_task
            WHERE source_entity_ref_id IS NULL
        )
        """
    )

    # Remove inbox tasks with no source_entity_ref_id.
    op.execute(
        """
        DELETE FROM inbox_task
        WHERE source_entity_ref_id IS NULL
        """
    )

    # Remove todo task events for todo tasks not referenced by any inbox task.
    op.execute(
        """
        DELETE FROM todo_task_event
        WHERE owner_ref_id IN (
            SELECT ref_id
            FROM todo_task
            WHERE ref_id NOT IN (
                SELECT DISTINCT source_entity_ref_id
                FROM inbox_task
                WHERE source_entity_ref_id IS NOT NULL
            )
        )
        """
    )

    # Remove todo tasks not referenced by any inbox task via source_entity_ref_id.
    op.execute(
        """
        DELETE FROM todo_task
        WHERE ref_id NOT IN (
            SELECT DISTINCT source_entity_ref_id
            FROM inbox_task
            WHERE source_entity_ref_id IS NOT NULL
        )
        """
    )


def downgrade():
    # Data removal is irreversible.
    pass
