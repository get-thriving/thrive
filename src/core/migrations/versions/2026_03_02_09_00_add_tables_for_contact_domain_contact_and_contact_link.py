"""'Tables for contact domain, contact, and contact link'

Revision ID: b34b53f95a4a
Revises: fae49c835e4e
Create Date: 2026-03-02 09:00:00.000000

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "b34b53f95a4a"
down_revision = "fae49c835e4e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE contact_domain (
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
        CREATE UNIQUE INDEX ix_contact_domain_workspace_ref_id ON contact_domain (workspace_ref_id)
        """
    )
    op.execute(
        """
        CREATE TABLE contact_domain_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES contact_domain (ref_id)
        )
        """
    )

    op.execute(
        """
        CREATE TABLE contact (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            contact_domain_ref_id INTEGER NOT NULL,
            name VARCHAR(255) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (contact_domain_ref_id) REFERENCES contact_domain (ref_id)
        )
        """
    )
    op.execute(
        """
        CREATE UNIQUE INDEX ix_contact_contact_domain_ref_id_name ON contact (contact_domain_ref_id, name)
        """
    )
    op.execute(
        """
        CREATE TABLE contact_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES contact (ref_id)
        )
        """
    )

    op.execute(
        """
        CREATE TABLE contact_link (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            name VARCHAR(255) NOT NULL,
            contact_domain_ref_id INTEGER NOT NULL,
            namespace VARCHAR(255) NOT NULL,
            source_entity_ref_id INTEGER NOT NULL,
            contacts_ref_ids JSON NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (contact_domain_ref_id) REFERENCES contact_domain (ref_id)
        )
        """
    )
    op.execute(
        """
        CREATE UNIQUE INDEX ix_contact_link_contact_domain_ref_id_namespace_source_entity_ref_id ON contact_link (contact_domain_ref_id, namespace, source_entity_ref_id)
        """
    )
    op.execute(
        """
        CREATE UNIQUE INDEX ix_contact_link_namespace_source_entity_ref_id ON contact_link (namespace, source_entity_ref_id)
        """
    )
    op.execute(
        """
        CREATE TABLE contact_link_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES contact_link (ref_id)
        )
        """
    )

    op.execute(
        """
        INSERT INTO contact_domain
               SELECT
                   ref_id as ref_id,
                   1 as version,
                   archived as archived,
                   archival_reason as archival_reason,
                   created_time as created_time,
                   last_modified_time as last_modified_time,
                   archived_time as archived_time,
                   ref_id as workspace_ref_id
               FROM workspace;
        """
    )
    op.execute(
        """
        INSERT INTO contact_domain_event
               SELECT
                   ref_id as owner_ref_id,
                   created_time as timestamp,
                   0 as session_index,
                   'Created' as name,
                   'Cli' as source,
                   1 as owner_version,
                   'Created' as kind,
                   '{}' as data
               FROM contact_domain;
        """
    )


def downgrade() -> None:
    op.execute("""DROP TABLE IF EXISTS contact_link_event""")
    op.execute("""DROP TABLE IF EXISTS contact_link""")
    op.execute("""DROP TABLE IF EXISTS contact_event""")
    op.execute("""DROP TABLE IF EXISTS contact""")
    op.execute("""DROP TABLE IF EXISTS contact_domain_event""")
    op.execute("""DROP TABLE IF EXISTS contact_domain""")
