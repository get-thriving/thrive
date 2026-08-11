"""inbox task owner pattern index

Revision ID: a2599768b387
Revises: 324048d286d2
Create Date: 2026-08-11 18:00:00.000000

"""

from alembic import op

revision = "a2599768b387"
down_revision = "324048d286d2"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # InboxTaskRepository.find_all_for_parent_link_namespaces and
    # find_completed_in_range filter
    # `inbox_task_collection_ref_id = X AND (owner LIKE 'Type:%' OR owner LIKE
    # 'Type:%' OR ...)`, with one LIKE clause per parent-link namespace
    # (commonly 10+ when no explicit namespace filter is passed, since it
    # defaults to every namespace enabled for the workspace). None of those
    # LIKE clauses can use an index range scan under a non-C database locale
    # without an explicit pattern-matching operator class, so Postgres has to
    # recheck every row in the collection against all of them. This mirrors
    # the ix_access_status_user_entity_pattern fix for the same root cause.
    op.execute(
        """
        CREATE INDEX ix_inbox_task_collection_ref_id_owner_pattern
            ON inbox_task (inbox_task_collection_ref_id, owner varchar_pattern_ops)
    """
    )


def downgrade() -> None:
    op.execute("DROP INDEX ix_inbox_task_collection_ref_id_owner_pattern")
