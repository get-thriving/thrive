"""access status entity pattern index

Revision ID: 324048d286d2
Revises: d70d07199f1d
Create Date: 2026-08-11 17:00:00.000000

"""

revision = "324048d286d2"
down_revision = "d70d07199f1d"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # No-op on SQLite: its LIKE-prefix optimization already uses the existing
    # ix_access_status_user_entity (user_ref_id, entity) index without needing
    # a special operator class. This revision exists to keep the postgres and
    # sqlite migration chains paired.
    pass


def downgrade() -> None:
    pass
