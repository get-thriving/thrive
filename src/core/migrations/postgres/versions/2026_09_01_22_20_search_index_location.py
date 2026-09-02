"""Search index location fields.

Revision ID: a1b2c3d4e5f6
Revises: 97f46facfa8e
Create Date: 2026-09-01 22:20:00.000000

"""

from alembic import op

revision = "a1b2c3d4e5f6"
down_revision = "97f46facfa8e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE search_index
            ADD COLUMN location_name VARCHAR NOT NULL DEFAULT ''
    """
    )
    op.execute(
        """
        ALTER TABLE search_index
            ADD COLUMN location_address VARCHAR NOT NULL DEFAULT ''
    """
    )
    op.execute(
        """
        ALTER TABLE search_index
            ADD COLUMN location_country VARCHAR NOT NULL DEFAULT ''
    """
    )
    op.execute(
        """
        ALTER TABLE search_index
            ADD COLUMN location_gps VARCHAR NOT NULL DEFAULT ''
    """
    )

    op.execute(
        """
        CREATE INDEX ix_search_index_location_name_trgm
            ON search_index USING gin (location_name gin_trgm_ops)
    """
    )
    op.execute(
        """
        CREATE INDEX ix_search_index_location_address_trgm
            ON search_index USING gin (location_address gin_trgm_ops)
    """
    )
    op.execute(
        """
        CREATE INDEX ix_search_index_location_country_trgm
            ON search_index USING gin (location_country gin_trgm_ops)
    """
    )
    op.execute(
        """
        CREATE INDEX ix_search_index_location_gps_trgm
            ON search_index USING gin (location_gps gin_trgm_ops)
    """
    )

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
    op.execute("DROP INDEX ix_search_index_location_gps_trgm")
    op.execute("DROP INDEX ix_search_index_location_country_trgm")
    op.execute("DROP INDEX ix_search_index_location_address_trgm")
    op.execute("DROP INDEX ix_search_index_location_name_trgm")
    op.execute("ALTER TABLE search_index DROP COLUMN location_gps")
    op.execute("ALTER TABLE search_index DROP COLUMN location_country")
    op.execute("ALTER TABLE search_index DROP COLUMN location_address")
    op.execute("ALTER TABLE search_index DROP COLUMN location_name")
