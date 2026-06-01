"""Search domain.

Revision ID: 3ce25ef103a3
Revises: cc2bee6de197
Create Date: 2026-05-31 15:12:01.331440

"""

from alembic import op
from sqlalchemy import text

revision = "3ce25ef103a3"
down_revision = "cc2bee6de197"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE search_domain (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            archival_reason VARCHAR,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX ix_search_domain_workspace_ref_id
            ON search_domain (workspace_ref_id)
    """
    )

    conn = op.get_bind()
    conn.execute(
        text(
            """
            INSERT INTO search_domain (
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

    _rebuild_search_entity_indexing_map_for_search_domain(conn)
    _rebuild_search_mutation_log_for_search_domain(conn)


def downgrade() -> None:
    conn = op.get_bind()

    _rebuild_search_mutation_log_for_workspace(conn)
    _rebuild_search_entity_indexing_map_for_workspace(conn)

    op.execute("DROP INDEX ix_search_domain_workspace_ref_id")
    op.execute("DROP TABLE search_domain")


def _rebuild_search_entity_indexing_map_for_search_domain(conn) -> None:
    """Replace workspace_ref_id with search_domain_ref_id (SQLite table rebuild)."""
    op.execute(
        """
        DROP INDEX IF EXISTS ix_search_entity_indexing_map_workspace_entity_type
    """
    )

    op.execute(
        """
        CREATE TABLE search_entity_indexing_map_new (
            search_domain_ref_id INTEGER NOT NULL,
            entity_type VARCHAR NOT NULL,
            entity_ref_id INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            object_id VARCHAR NOT NULL,
            CONSTRAINT fk_search_entity_indexing_map_search_domain_ref_id
                FOREIGN KEY (search_domain_ref_id) REFERENCES search_domain (ref_id),
            CONSTRAINT uq_search_entity_indexing_map_search_domain_entity
                UNIQUE (search_domain_ref_id, entity_type, entity_ref_id)
        )
    """
    )

    conn.execute(
        text(
            """
            INSERT INTO search_entity_indexing_map_new (
                search_domain_ref_id,
                entity_type,
                entity_ref_id,
                created_time,
                last_modified_time,
                object_id
            )
            SELECT
                search_domain.ref_id,
                search_entity_indexing_map.entity_type,
                search_entity_indexing_map.entity_ref_id,
                search_entity_indexing_map.created_time,
                search_entity_indexing_map.last_modified_time,
                search_entity_indexing_map.object_id
            FROM search_entity_indexing_map
            INNER JOIN search_domain
                ON search_domain.workspace_ref_id
                = search_entity_indexing_map.workspace_ref_id
            """
        )
    )

    op.execute("DROP TABLE search_entity_indexing_map")
    op.execute(
        "ALTER TABLE search_entity_indexing_map_new RENAME TO search_entity_indexing_map"
    )

    op.execute(
        """
        CREATE INDEX ix_search_entity_indexing_map_search_domain_entity_type
            ON search_entity_indexing_map (search_domain_ref_id, entity_type)
    """
    )


def _rebuild_search_entity_indexing_map_for_workspace(conn) -> None:
    op.execute(
        """
        DROP INDEX IF EXISTS ix_search_entity_indexing_map_search_domain_entity_type
    """
    )

    op.execute(
        """
        CREATE TABLE search_entity_indexing_map_new (
            workspace_ref_id INTEGER NOT NULL,
            entity_type VARCHAR NOT NULL,
            entity_ref_id INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            object_id VARCHAR NOT NULL,
            CONSTRAINT fk_search_entity_indexing_map_workspace_ref_id
                FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id),
            CONSTRAINT uq_search_entity_indexing_map_workspace_entity
                UNIQUE (workspace_ref_id, entity_type, entity_ref_id)
        )
    """
    )

    conn.execute(
        text(
            """
            INSERT INTO search_entity_indexing_map_new (
                workspace_ref_id,
                entity_type,
                entity_ref_id,
                created_time,
                last_modified_time,
                object_id
            )
            SELECT
                search_domain.workspace_ref_id,
                search_entity_indexing_map.entity_type,
                search_entity_indexing_map.entity_ref_id,
                search_entity_indexing_map.created_time,
                search_entity_indexing_map.last_modified_time,
                search_entity_indexing_map.object_id
            FROM search_entity_indexing_map
            INNER JOIN search_domain
                ON search_domain.ref_id
                = search_entity_indexing_map.search_domain_ref_id
            """
        )
    )

    op.execute("DROP TABLE search_entity_indexing_map")
    op.execute(
        "ALTER TABLE search_entity_indexing_map_new RENAME TO search_entity_indexing_map"
    )

    op.execute(
        """
        CREATE INDEX ix_search_entity_indexing_map_workspace_entity_type
            ON search_entity_indexing_map (workspace_ref_id, entity_type)
    """
    )


def _rebuild_search_mutation_log_for_search_domain(conn) -> None:
    op.execute("DROP INDEX IF EXISTS ix_search_mutation_log_status")

    op.execute(
        """
        CREATE TABLE search_mutation_log_new (
            mutation_id VARCHAR NOT NULL,
            search_domain_ref_id INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            status VARCHAR NOT NULL,
            CONSTRAINT pk_search_mutation_log_mutation_id PRIMARY KEY (mutation_id),
            CONSTRAINT fk_search_mutation_log_search_domain_ref_id
                FOREIGN KEY (search_domain_ref_id) REFERENCES search_domain (ref_id)
        )
    """
    )

    conn.execute(
        text(
            """
            INSERT INTO search_mutation_log_new (
                mutation_id,
                search_domain_ref_id,
                created_time,
                last_modified_time,
                status
            )
            SELECT
                search_mutation_log.mutation_id,
                search_domain.ref_id,
                search_mutation_log.created_time,
                search_mutation_log.last_modified_time,
                search_mutation_log.status
            FROM search_mutation_log
            INNER JOIN search_domain
                ON search_domain.workspace_ref_id
                = search_mutation_log.workspace_ref_id
            """
        )
    )

    op.execute("DROP TABLE search_mutation_log")
    op.execute("ALTER TABLE search_mutation_log_new RENAME TO search_mutation_log")

    op.execute(
        """
        CREATE INDEX ix_search_mutation_log_status ON search_mutation_log (status)
    """
    )


def _rebuild_search_mutation_log_for_workspace(conn) -> None:
    op.execute("DROP INDEX IF EXISTS ix_search_mutation_log_status")

    op.execute(
        """
        CREATE TABLE search_mutation_log_new (
            mutation_id VARCHAR NOT NULL,
            workspace_ref_id INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            status VARCHAR NOT NULL,
            CONSTRAINT pk_search_mutation_log_mutation_id PRIMARY KEY (mutation_id),
            CONSTRAINT fk_search_mutation_log_workspace_ref_id
                FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
    """
    )

    conn.execute(
        text(
            """
            INSERT INTO search_mutation_log_new (
                mutation_id,
                workspace_ref_id,
                created_time,
                last_modified_time,
                status
            )
            SELECT
                search_mutation_log.mutation_id,
                search_domain.workspace_ref_id,
                search_mutation_log.created_time,
                search_mutation_log.last_modified_time,
                search_mutation_log.status
            FROM search_mutation_log
            INNER JOIN search_domain
                ON search_domain.ref_id = search_mutation_log.search_domain_ref_id
            """
        )
    )

    op.execute("DROP TABLE search_mutation_log")
    op.execute("ALTER TABLE search_mutation_log_new RENAME TO search_mutation_log")

    op.execute(
        """
        CREATE INDEX ix_search_mutation_log_status ON search_mutation_log (status)
    """
    )
