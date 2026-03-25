"""'Remove inbox task feature and tags'

Revision ID: c59ea1b1c62c
Revises: 6ceb5803cd4f
Create Date: 2026-03-24 16:16:42.897542

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "c59ea1b1c62c"
down_revision = "6ceb5803cd4f"
branch_labels = None
depends_on = None


def _remove_sync_target_from_array(table: str, column: str) -> None:
    op.execute(
        f"""
        UPDATE {table}
        SET {column} = COALESCE(
            (
                SELECT json_group_array(value)
                FROM json_each({column})
                WHERE value <> 'inbox-tasks'
            ),
            '[]'
        )
        WHERE {column} IS NOT NULL
          AND EXISTS (
              SELECT 1
              FROM json_each({column})
              WHERE value = 'inbox-tasks'
          )
        """  # nosec B608
    )


def _remove_inbox_task_entity_tag_from_array(table: str, column: str) -> None:
    op.execute(
        f"""
        UPDATE {table}
        SET {column} = COALESCE(
            (
                SELECT json_group_array(value)
                FROM json_each({column})
                WHERE json_extract(value, '$.entity_tag') <> 'InboxTask'
            ),
            '[]'
        )
        WHERE {column} IS NOT NULL
          AND EXISTS (
              SELECT 1
              FROM json_each({column})
              WHERE json_extract(value, '$.entity_tag') = 'InboxTask'
          )
        """  # nosec B608
    )


def upgrade():
    op.execute(
        """
        UPDATE workspace
        SET feature_flags = json_remove(feature_flags, '$."inbox-tasks"')
        WHERE feature_flags IS NOT NULL
          AND json_type(feature_flags, '$."inbox-tasks"') IS NOT NULL
        """
    )

    _remove_sync_target_from_array("gc_log_entry", "gc_targets")
    _remove_sync_target_from_array("gen_log_entry", "gen_targets")
    _remove_sync_target_from_array("stats_log_entry", "stats_targets")

    _remove_inbox_task_entity_tag_from_array("gc_log_entry", "entity_records")
    _remove_inbox_task_entity_tag_from_array(
        "schedule_external_sync_log_entry", "entity_records"
    )
    _remove_inbox_task_entity_tag_from_array("stats_log_entry", "entity_records")
    _remove_inbox_task_entity_tag_from_array("gen_log_entry", "entity_created_records")
    _remove_inbox_task_entity_tag_from_array("gen_log_entry", "entity_updated_records")
    _remove_inbox_task_entity_tag_from_array("gen_log_entry", "entity_removed_records")

    op.execute("DELETE FROM search_index WHERE entity_tag = 'InboxTask'")


def downgrade():
    # Data removal is irreversible.
    pass
