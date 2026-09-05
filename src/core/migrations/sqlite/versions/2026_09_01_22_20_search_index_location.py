"""Search index location fields.

Revision ID: a1b2c3d4e5f6
Revises: 97f46facfa8e
Create Date: 2026-09-01 22:20:00.000000

"""

from alembic import op
from sqlalchemy import text

revision = "a1b2c3d4e5f6"
down_revision = "97f46facfa8e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("PRAGMA foreign_keys=OFF")

    op.execute(
        """
        CREATE VIRTUAL TABLE search_index_new USING fts5(
            workspace_ref_id,
            search_domain_ref_id UNINDEXED,
            entity_tag,
            parent_ref_id UNINDEXED,
            ref_id UNINDEXED,
            name,
            note,
            location_name,
            location_address,
            location_country,
            location_gps,
            archived UNINDEXED,
            created_time,
            last_modified_time,
            archived_time,
            tokenize="porter unicode61 remove_diacritics 1"
        )
    """
    )

    conn = op.get_bind()
    conn.execute(
        text(
            """
            INSERT INTO search_index_new (
                workspace_ref_id,
                search_domain_ref_id,
                entity_tag,
                parent_ref_id,
                ref_id,
                name,
                note,
                location_name,
                location_address,
                location_country,
                location_gps,
                archived,
                created_time,
                last_modified_time,
                archived_time
            )
            SELECT
                workspace_ref_id,
                search_domain_ref_id,
                entity_tag,
                parent_ref_id,
                ref_id,
                name,
                note,
                '',
                '',
                '',
                '',
                archived,
                created_time,
                last_modified_time,
                archived_time
            FROM search_index
            """
        )
    )

    op.execute('DROP TABLE "search_index"')
    op.execute('ALTER TABLE search_index_new RENAME TO "search_index"')

    op.execute("PRAGMA foreign_keys=ON")

    op.execute(
        """
        CREATE TABLE search_index_location (
            workspace_ref_id INTEGER NOT NULL,
            search_domain_ref_id INTEGER NOT NULL,
            entity_tag VARCHAR NOT NULL,
            entity_ref_id INTEGER NOT NULL,
            location_ref_id INTEGER NOT NULL,
            PRIMARY KEY (
                workspace_ref_id, entity_tag, entity_ref_id, location_ref_id
            ),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id),
            FOREIGN KEY (search_domain_ref_id) REFERENCES search_domain (ref_id),
            FOREIGN KEY (workspace_ref_id, entity_tag, entity_ref_id)
                REFERENCES search_index (workspace_ref_id, entity_tag, ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_search_index_location_workspace_ref_id
            ON search_index_location (workspace_ref_id)
    """
    )


def downgrade() -> None:
    op.execute("DROP INDEX ix_search_index_location_workspace_ref_id")
    op.execute("DROP TABLE search_index_location")

    op.execute("PRAGMA foreign_keys=OFF")

    op.execute(
        """
        CREATE VIRTUAL TABLE search_index_old USING fts5(
            workspace_ref_id,
            search_domain_ref_id UNINDEXED,
            entity_tag,
            parent_ref_id UNINDEXED,
            ref_id UNINDEXED,
            name,
            note,
            archived UNINDEXED,
            created_time,
            last_modified_time,
            archived_time,
            tokenize="porter unicode61 remove_diacritics 1"
        )
    """
    )

    conn = op.get_bind()
    conn.execute(
        text(
            """
            INSERT INTO search_index_old (
                workspace_ref_id,
                search_domain_ref_id,
                entity_tag,
                parent_ref_id,
                ref_id,
                name,
                note,
                archived,
                created_time,
                last_modified_time,
                archived_time
            )
            SELECT
                workspace_ref_id,
                search_domain_ref_id,
                entity_tag,
                parent_ref_id,
                ref_id,
                name,
                note,
                archived,
                created_time,
                last_modified_time,
                archived_time
            FROM search_index
            """
        )
    )

    op.execute('DROP TABLE "search_index"')
    op.execute('ALTER TABLE search_index_old RENAME TO "search_index"')

    op.execute("PRAGMA foreign_keys=ON")
