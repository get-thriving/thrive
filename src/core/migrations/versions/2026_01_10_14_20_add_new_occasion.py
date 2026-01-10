"""'Add new occasion'

Revision ID: d33c1d34e857
Revises: 3c8a2d5b7f10
Create Date: 2026-01-10 14:20:29.983270

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd33c1d34e857'
down_revision = '3c8a2d5b7f10'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE occasion (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            person_ref_id INTEGER NOT NULL,
            kind VARCHAR NOT NULL,
            name VARCHAR NOT NULL,
            date VARCHAR NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (person_ref_id) REFERENCES person (ref_id)
        )
    """
    )
    op.execute(
        """
        CREATE INDEX ix_occasion_person_ref_id ON occasion (person_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE occasion_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES occasion (ref_id)
        )
    """
    )


def downgrade() -> None:
    op.execute("DROP TABLE occasion_event")
    op.execute("DROP TABLE occasion")
