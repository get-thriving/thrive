"""inbox task owner pattern index

Revision ID: a2599768b387
Revises: 324048d286d2
Create Date: 2026-08-11 18:00:00.000000

"""

revision = "a2599768b387"
down_revision = "324048d286d2"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # No-op on SQLite: its LIKE-prefix optimization already uses the existing
    # ix_inbox_task_pagination (inbox_task_collection_ref_id, owner,
    # created_time) index without needing a special operator class. This
    # revision exists to keep the postgres and sqlite migration chains paired.
    pass


def downgrade() -> None:
    pass
