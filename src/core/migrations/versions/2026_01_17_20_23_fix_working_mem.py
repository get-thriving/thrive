"""'Fix working mem'

Revision ID: d3391e789c2a
Revises: 7b2e4f8a1c3d
Create Date: 2026-01-17 20:23:44.655870

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "d3391e789c2a"
down_revision = "7b2e4f8a1c3d"
branch_labels = None
depends_on = None


def upgrade():
    # First, for collections that have working_mem entities, keep only the latest one
    # and update the name to be generic
    op.execute(
        """
        WITH latest_working_mem AS (
            SELECT
                working_mem_collection_ref_id,
                ref_id,
                ROW_NUMBER() OVER (
                    PARTITION BY working_mem_collection_ref_id
                    ORDER BY created_time DESC
                ) as rn
            FROM working_mem
            WHERE archived = FALSE
        )
        UPDATE working_mem
        SET name = 'Working Memory',
            archived = CASE WHEN rn > 1 THEN TRUE ELSE FALSE END,
            archived_time = CASE WHEN rn > 1 THEN last_modified_time ELSE NULL END
        FROM latest_working_mem lwm
        WHERE working_mem.ref_id = lwm.ref_id
        """
    )

    # Delete the working_mem entities that are not the latest one
    op.execute(
        """
        DELETE FROM working_mem
        WHERE archived = TRUE
        """
    )

    # Drop the old unique index that included period and timeline
    op.execute(
        """
        DROP INDEX IF EXISTS ix_working_mem_working_mem_collection_ref_id_period_timeline
        """
    )

    # Drop the old columns
    with op.batch_alter_table("working_mem") as batch_op:
        batch_op.drop_column("right_now")
        batch_op.drop_column("period")
        batch_op.drop_column("timeline")

    # Create working_mem entities for collections that don't have any
    op.execute(
        """
        INSERT INTO working_mem (
            version,
            archived,
            created_time,
            last_modified_time,
            archived_time,
            working_mem_collection_ref_id,
            name
        )
        SELECT
            1,
            FALSE,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            NULL,
            wmc.ref_id,
            'Working Memory'
        FROM working_mem_collection wmc
        WHERE NOT EXISTS (
            SELECT 1 FROM working_mem wm
            WHERE wm.working_mem_collection_ref_id = wmc.ref_id
            AND wm.archived = FALSE
        )
        """
    )

    # Update inbox tasks with WORKING_MEM_CLEANUP source to point to the collection instead of working mem
    op.execute(
        """
        UPDATE inbox_task
        SET source_entity_ref_id = wm.working_mem_collection_ref_id
        FROM working_mem wm
        WHERE inbox_task.source = 'working-mem-cleanup'
        AND inbox_task.source_entity_ref_id = wm.ref_id
        """
    )

    # Add a unique constraint to ensure only one working_mem per collection
    op.execute(
        """
        CREATE UNIQUE INDEX ix_working_mem_working_mem_collection_ref_id_singleton
        ON working_mem (working_mem_collection_ref_id)
        WHERE archived = FALSE
        """
    )


def downgrade():
    pass
