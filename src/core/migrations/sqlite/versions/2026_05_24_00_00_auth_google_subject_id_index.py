"""Auth google subject id index.

Revision ID: e7a2b9c4d1f0
Revises: cd47f8a1e923
Create Date: 2026-05-24 00:00:00.000000

"""

from alembic import op

revision = "e7a2b9c4d1f0"
down_revision = "cd47f8a1e923"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_index(
        "ix_auth_google_google_subject_id",
        "auth_google",
        ["google_subject_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_auth_google_google_subject_id", table_name="auth_google")
