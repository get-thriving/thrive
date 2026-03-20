"""'Backfill user tasks'

Revision ID: 16fdcdd66f85
Revises: 794ae553e53d
Create Date: 2026-03-20 15:39:24.350342

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "16fdcdd66f85"
down_revision = "794ae553e53d"
branch_labels = None
depends_on = None


def upgrade():
    op.execute(
        """
        CREATE TEMP TABLE tmp_user_inbox_task_to_todo_task AS
        WITH candidates AS (
            SELECT
                it.ref_id AS inbox_task_ref_id,
                (
                    (SELECT IFNULL(MAX(ref_id), 0) FROM todo_task)
                    + ROW_NUMBER() OVER (ORDER BY it.ref_id)
                ) AS todo_task_ref_id,
                it.archived AS archived,
                it.archival_reason AS archival_reason,
                it.created_time AS created_time,
                it.last_modified_time AS last_modified_time,
                it.archived_time AS archived_time,
                td.ref_id AS todo_domain_ref_id,
                it.name AS name,
                it.aspect_ref_id AS aspect_ref_id,
                it.chapter_ref_id AS chapter_ref_id,
                it.goal_ref_id AS goal_ref_id
            FROM inbox_task it
            JOIN inbox_task_collection ic
                ON ic.ref_id = it.inbox_task_collection_ref_id
            JOIN todo_domain td
                ON td.workspace_ref_id = ic.workspace_ref_id
            WHERE it.source = 'user'
              AND it.source_entity_ref_id IS NULL
        )
        SELECT * FROM candidates
        """
    )

    op.execute(
        """
        INSERT INTO todo_task (
            ref_id,
            version,
            archived,
            archival_reason,
            created_time,
            last_modified_time,
            archived_time,
            todo_domain_ref_id,
            name,
            aspect_ref_id,
            chapter_ref_id,
            goal_ref_id
        )
        SELECT
            todo_task_ref_id,
            1,
            archived,
            archival_reason,
            created_time,
            last_modified_time,
            archived_time,
            todo_domain_ref_id,
            name,
            aspect_ref_id,
            chapter_ref_id,
            goal_ref_id
        FROM tmp_user_inbox_task_to_todo_task
        """
    )

    op.execute(
        """
        INSERT INTO todo_task_event (
            owner_ref_id,
            timestamp,
            session_index,
            name,
            source,
            owner_version,
            kind,
            data
        )
        SELECT
            todo_task_ref_id,
            created_time,
            0,
            'Created',
            'Cli',
            1,
            'Created',
            '{}'
        FROM tmp_user_inbox_task_to_todo_task
        """
    )

    op.execute(
        """
        UPDATE inbox_task
        SET source_entity_ref_id = (
            SELECT tmp.todo_task_ref_id
            FROM tmp_user_inbox_task_to_todo_task tmp
            WHERE tmp.inbox_task_ref_id = inbox_task.ref_id
        )
        WHERE ref_id IN (
            SELECT inbox_task_ref_id
            FROM tmp_user_inbox_task_to_todo_task
        )
        """
    )

    op.execute("""DROP TABLE IF EXISTS tmp_user_inbox_task_to_todo_task""")


def downgrade():
    pass
