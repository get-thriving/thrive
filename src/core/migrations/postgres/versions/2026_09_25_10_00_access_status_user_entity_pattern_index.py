"""access status user entity pattern index

Revision ID: 5346a0ebce82
Revises: f1a2b3c4d5e6
Create Date: 2026-09-25 10:00:00.000000

"""

from alembic import op

revision = "5346a0ebce82"
down_revision = "f1a2b3c4d5e6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # AccessStatusRepository.find_all_for_user filters
    # `user_ref_id = X AND entity LIKE 'Type:%'`, which backs every
    # find_accessible_ref_ids / find_all_entities call on crown entities. Under
    # a non-C database locale the existing ix_access_status_user_entity
    # (user_ref_id, entity) index cannot serve the LIKE prefix as a range scan,
    # so Postgres reads every access status row the user has and rechecks the
    # pattern on each one. An explicit pattern-matching operator class lets the
    # prefix be used as an index range.
    op.execute(
        """
        CREATE INDEX ix_access_status_user_entity_pattern
            ON access_status (user_ref_id, entity varchar_pattern_ops)
    """
    )


def downgrade() -> None:
    op.execute("DROP INDEX ix_access_status_user_entity_pattern")
