"""'Tables for tag domain tag and tag link'

Revision ID: a30c99ae2b0e
Revises: d256a207ae11
Create Date: 2026-02-08 14:44:56.514537

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "a30c99ae2b0e"
down_revision = "d256a207ae11"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE tag_domain (
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
        CREATE UNIQUE INDEX ix_tag_domain_workspace_ref_id ON tag_domain (workspace_ref_id)
        """
    )
    op.execute(
        """
        CREATE TABLE tag_domain_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES tag_domain (ref_id)
        )
        """
    )

    op.execute(
        """
        CREATE TABLE tag (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            tag_domain_ref_id INTEGER NOT NULL,
            namespace VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (tag_domain_ref_id) REFERENCES tag_domain (ref_id)
        )
        """
    )
    op.execute(
        """
        CREATE UNIQUE INDEX ix_tag_tag_domain_ref_id_namespace_name ON tag (tag_domain_ref_id, namespace, name)
        """
    )

    op.execute(
        """
        CREATE TABLE tag_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES tag (ref_id)
        )
        """
    )

    op.execute(
        """
        CREATE TABLE tag_link (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            tag_domain_ref_id INTEGER NOT NULL,
            namespace VARCHAR(255) NOT NULL,
            source_entity_ref_id INTEGER NOT NULL,
            ref_ids JSON NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (tag_domain_ref_id) REFERENCES tag_domain (ref_id)
        )
        """
    )
    op.execute(
        """
        CREATE UNIQUE INDEX ix_tag_link_tag_domain_ref_id_namespace_source_entity_ref_id ON tag_link (tag_domain_ref_id, namespace, source_entity_ref_id)
        """
    )
    op.execute(
        """
        CREATE UNIQUE INDEX ix_tag_link_namespace_source_entity_ref_id ON tag_link (namespace, source_entity_ref_id)
        """
    )
    op.execute(
        """
        CREATE TABLE tag_link_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES tag_link (ref_id)
        )
        """
    )


def downgrade() -> None:
    op.execute("""DROP TABLE IF EXISTS tag_link_event""")
    op.execute("""DROP TABLE IF EXISTS tag_link""")
    op.execute("""DROP TABLE IF EXISTS tag_event""")
    op.execute("""DROP TABLE IF EXISTS tag""")
    op.execute("""DROP TABLE IF EXISTS tag_domain_event""")
    op.execute("""DROP TABLE IF EXISTS tag_domain""")
