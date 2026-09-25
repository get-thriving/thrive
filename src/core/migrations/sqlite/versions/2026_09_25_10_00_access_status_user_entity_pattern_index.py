"""access status user entity pattern index

Revision ID: 5346a0ebce82
Revises: f1a2b3c4d5e6
Create Date: 2026-09-25 10:00:00.000000

"""

revision = "5346a0ebce82"
down_revision = "f1a2b3c4d5e6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # No-op on SQLite: varchar_pattern_ops is a Postgres-only operator class.
    # This revision exists to keep the postgres and sqlite migration chains
    # paired.
    pass


def downgrade() -> None:
    pass
