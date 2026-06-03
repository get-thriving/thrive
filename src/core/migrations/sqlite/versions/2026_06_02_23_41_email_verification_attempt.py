"""email verification attempt

Revision ID: 9b53b5d8b981
Revises: dbcc639f25d1
Create Date: 2026-06-02 23:41:33.010786

"""

from alembic import op

revision = "9b53b5d8b981"
down_revision = "dbcc639f25d1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE email_verification_attempt (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            user_ref_id INTEGER NOT NULL,
            name VARCHAR NOT NULL DEFAULT 'Email Verification',
            code VARCHAR NOT NULL,
            expires_in_mins INTEGER NOT NULL,
            retries INTEGER NOT NULL,
            solved BOOLEAN NOT NULL,
            email_sent BOOLEAN NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (user_ref_id) REFERENCES "user" (ref_id)
        )
        """
    )

    op.execute(
        """
        CREATE INDEX ix_email_verification_attempt_user_ref_id
        ON email_verification_attempt (user_ref_id)
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE email_verification_attempt")
