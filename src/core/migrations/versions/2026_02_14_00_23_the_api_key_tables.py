"""'The api_key tables'

Revision ID: 401d1beb0142
Revises: 115a862cf5d0
Create Date: 2026-02-14 00:23:27.595333

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "401d1beb0142"
down_revision = "115a862cf5d0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE api_key (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            user_ref_id INTEGER NOT NULL,
            name VARCHAR(255) NOT NULL,
            key_hash VARCHAR(255) NOT NULL,
            key_size INTEGER NOT NULL,
            last_four_digits VARCHAR(16) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (user_ref_id) REFERENCES user (ref_id)
        )
        """
    )
    op.execute(
        """
        CREATE INDEX ix_api_key_user_ref_id ON api_key (user_ref_id)
        """
    )
    op.execute(
        """
        CREATE TABLE api_key_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES api_key (ref_id)
        )
        """
    )


def downgrade() -> None:
    op.execute("""DROP TABLE IF EXISTS api_key_event""")
    op.execute("""DROP TABLE IF EXISTS api_key""")
