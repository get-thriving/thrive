"""Auth local/google restructure.

Revision ID: cd47f8a1e923
Revises: ab36fc01bdf0
Create Date: 2026-05-22 00:00:00.000000

"""

import sqlalchemy as sa
from alembic import op

revision = "cd47f8a1e923"
down_revision = "ab36fc01bdf0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Rename auth → auth_local (class AuthLocal maps to table auth_local)
    op.rename_table("auth", "auth_local")

    # 2. Add auth_method column to user (default 'local' for all existing rows)
    with op.batch_alter_table("user") as batch_op:
        batch_op.add_column(
            sa.Column(
                "auth_method",
                sa.String(),
                nullable=False,
                server_default="local",
            )
        )

    # 3. Create auth_google table
    op.execute(
        """
        CREATE TABLE auth_google (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            user_ref_id INTEGER NOT NULL UNIQUE,
            google_subject_id VARCHAR NOT NULL UNIQUE,
            refresh_token VARCHAR NOT NULL,
            refresh_token_expired BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (user_ref_id) REFERENCES "user" (ref_id)
        )
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE auth_google")
    with op.batch_alter_table("user") as batch_op:
        batch_op.drop_column("auth_method")
    op.rename_table("auth_local", "auth")
