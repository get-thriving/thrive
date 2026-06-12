"""publish domain

Revision ID: bd0eef3634c2
Revises: c3cc27543077
Create Date: 2026-06-07 00:29:19.794553

"""

from alembic import op
from sqlalchemy import text

revision = "bd0eef3634c2"
down_revision = "c3cc27543077"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE publish_domain (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
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
        CREATE UNIQUE INDEX ix_publish_domain_workspace_ref_id
            ON publish_domain (workspace_ref_id)
    """
    )

    conn = op.get_bind()
    conn.execute(
        text(
            """
            INSERT INTO publish_domain (
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
        CREATE TABLE publish_entity (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            publish_domain_ref_id INTEGER NOT NULL,
            name VARCHAR(255) NOT NULL,
            owner VARCHAR(256) NOT NULL,
            external_id VARCHAR(64) NOT NULL,
            status VARCHAR(32) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (publish_domain_ref_id) REFERENCES publish_domain (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_publish_entity_publish_domain_ref_id
            ON publish_entity (publish_domain_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_publish_entity_external_id
            ON publish_entity (external_id)
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_publish_entity_owner
            ON publish_entity (owner)
    """
    )


def downgrade() -> None:
    op.execute("DROP INDEX ix_publish_entity_owner")
    op.execute("DROP INDEX ix_publish_entity_external_id")
    op.execute("DROP INDEX ix_publish_entity_publish_domain_ref_id")
    op.execute("DROP TABLE publish_entity")
    op.execute("DROP INDEX ix_publish_domain_workspace_ref_id")
    op.execute("DROP TABLE publish_domain")
