"""location domain

Revision ID: c8d5f6a3b429
Revises: b7c4e5f2a318
Create Date: 2026-08-30 14:00:00.000000

"""

from alembic import op
from sqlalchemy import text

revision = "c8d5f6a3b429"
down_revision = "b7c4e5f2a318"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE location_domain (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_location_domain_workspace_ref_id
            ON location_domain (workspace_ref_id)
    """
    )

    conn = op.get_bind()
    conn.execute(
        text(
            """
            INSERT INTO location_domain (
                version,
                archived,
                archival_reason,
                created_time,
                last_modified_time,
                archived_time,
                workspace_ref_id
            )
            SELECT
                version,
                archived,
                archival_reason,
                created_time,
                last_modified_time,
                archived_time,
                ref_id
            FROM workspace
            """
        )
    )

    op.execute(
        """
        CREATE TABLE location (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            location_domain_ref_id INTEGER NOT NULL,
            name VARCHAR(255) NOT NULL,
            address_line VARCHAR,
            country VARCHAR,
            gps JSON,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (location_domain_ref_id) REFERENCES location_domain (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_location_location_domain_ref_id
            ON location (location_domain_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE location_link (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            name VARCHAR(255) NOT NULL,
            location_domain_ref_id INTEGER NOT NULL,
            location_ref_id INTEGER,
            owner VARCHAR(256) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (location_domain_ref_id) REFERENCES location_domain (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_location_link_owner ON location_link (owner)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_location_link_location_domain_ref_id_owner
            ON location_link (location_domain_ref_id, owner)
    """
    )


def downgrade() -> None:
    op.execute("DROP INDEX ix_location_link_location_domain_ref_id_owner")
    op.execute("DROP INDEX ix_location_link_owner")
    op.execute("DROP TABLE location_link")
    op.execute("DROP INDEX ix_location_location_domain_ref_id")
    op.execute("DROP TABLE location")
    op.execute("DROP INDEX ix_location_domain_workspace_ref_id")
    op.execute("DROP TABLE location_domain")
