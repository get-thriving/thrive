"""Add circles to persons.

Revision ID: c1a3d2b4e5f6
Revises: 8af611e06a5d
Create Date: 2026-01-05 12:00:00.000000

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "c1a3d2b4e5f6"
down_revision = "8af611e06a5d"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE circle (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            person_collection_ref_id INTEGER NOT NULL,
            name VARCHAR NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (person_collection_ref_id) REFERENCES person_collection (ref_id)
        )
        """
    )
    op.execute(
        """
        CREATE INDEX ix_circle_person_collection_ref_id
        ON circle (person_collection_ref_id)
        """
    )
    op.execute(
        """
        CREATE TABLE circle_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES circle (ref_id)
        )
        """
    )


def downgrade() -> None:
    pass
