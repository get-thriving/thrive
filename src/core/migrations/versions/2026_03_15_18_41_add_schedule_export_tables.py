"""'Add schedule export tables'

Revision ID: b22f61d44fb3
Revises: a15f6c2368ff
Create Date: 2026-03-15 18:41:27.069439

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "b22f61d44fb3"
down_revision = "a15f6c2368ff"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE schedule_export (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            schedule_domain_ref_id INTEGER NOT NULL,
            external_id VARCHAR(64) NOT NULL,
            name VARCHAR(255) NOT NULL,
            schedule_stream_ref_ids JSON NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (schedule_domain_ref_id) REFERENCES schedule_domain (ref_id)
        )
        """
    )
    op.execute(
        """
        CREATE INDEX ix_schedule_export_schedule_domain_ref_id ON schedule_export (schedule_domain_ref_id)
        """
    )
    op.execute(
        """
        CREATE INDEX ix_schedule_export_external_id ON schedule_export (external_id)
        """
    )
    op.execute(
        """
        CREATE TABLE schedule_export_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES schedule_export (ref_id)
        )
        """
    )


def downgrade() -> None:
    op.execute("""DROP TABLE IF EXISTS schedule_export_event""")
    op.execute("""DROP TABLE IF EXISTS schedule_export""")
