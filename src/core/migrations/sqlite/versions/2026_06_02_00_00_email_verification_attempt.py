"""Add email_verification_attempt table.

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-06-02 00:00:00.000000

"""

from alembic import op

revision = "b2c3d4e5f6a7"
down_revision = "a1b2c3d4e5f6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE email_verification_attempt (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            user_ref_id INTEGER NOT NULL UNIQUE,
            code_hash VARCHAR NOT NULL,
            expiry_duration_secs INTEGER NOT NULL,
            attempt_count INTEGER NOT NULL,
            solved BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (user_ref_id) REFERENCES "user" (ref_id)
        )
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE email_verification_attempt")
