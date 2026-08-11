"""access status entity pattern index

Revision ID: 324048d286d2
Revises: d70d07199f1d
Create Date: 2026-08-11 17:00:00.000000

"""

from alembic import op

revision = "324048d286d2"
down_revision = "d70d07199f1d"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # AccessStatusRepository.find_all_for_user filters
    # `user_ref_id = X AND entity LIKE 'EntityType:%'`. The existing
    # ix_access_status_user_entity (user_ref_id, entity) index can only use the
    # LIKE prefix as a range condition under a C-locale-equivalent operator
    # class. On a non-C database locale (the common case on managed Postgres),
    # Postgres can only use it for the user_ref_id equality and must recheck
    # every one of that user's access_status rows (across all entity types)
    # against the LIKE filter. This index adds an explicit pattern-matching
    # operator class so the prefix scan stays index-only regardless of locale.
    op.execute(
        """
        CREATE INDEX ix_access_status_user_entity_pattern
            ON access_status (user_ref_id, entity varchar_pattern_ops)
    """
    )


def downgrade() -> None:
    op.execute("DROP INDEX ix_access_status_user_entity_pattern")
