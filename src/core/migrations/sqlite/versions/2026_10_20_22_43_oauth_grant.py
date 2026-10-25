"""OAuth grant.

Revision ID: 609e423824c3
Revises: 43225f7bbedf
Create Date: 2026-10-20 22:43:49.629170

"""

from alembic import op

revision = "609e423824c3"
down_revision = "43225f7bbedf"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE o_auth_grant (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            user_ref_id INTEGER NOT NULL,
            name VARCHAR NOT NULL DEFAULT 'OAuth Grant',
            client_id VARCHAR NOT NULL,
            redirect_uri VARCHAR NOT NULL,
            resource VARCHAR NOT NULL,
            code_challenge VARCHAR NOT NULL,
            code_hash VARCHAR NOT NULL,
            code_redeemed BOOLEAN NOT NULL,
            refresh_hash VARCHAR NOT NULL,
            previous_refresh_hash VARCHAR NOT NULL,
            refresh_issued_time DATETIME,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (user_ref_id) REFERENCES "user" (ref_id)
        )
        """
    )

    op.execute(
        """
        CREATE INDEX ix_o_auth_grant_user_ref_id
        ON o_auth_grant (user_ref_id)
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE o_auth_grant")
