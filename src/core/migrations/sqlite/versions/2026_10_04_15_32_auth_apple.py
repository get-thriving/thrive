"""Auth apple.

Revision ID: 43225f7bbedf
Revises: a4421dd1fd86
Create Date: 2026-10-04 15:32:28.321368

"""

from alembic import op

revision = "43225f7bbedf"
down_revision = "a4421dd1fd86"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE auth_apple (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            user_ref_id INTEGER NOT NULL UNIQUE,
            apple_subject_id VARCHAR NOT NULL UNIQUE,
            refresh_token VARCHAR NOT NULL,
            refresh_token_expired BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (user_ref_id) REFERENCES "user" (ref_id)
        )
        """
    )
    op.create_index(
        "ix_auth_apple_apple_subject_id",
        "auth_apple",
        ["apple_subject_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_auth_apple_apple_subject_id", table_name="auth_apple")
    op.execute("DROP TABLE auth_apple")
