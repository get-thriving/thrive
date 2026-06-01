"""CRM entity indexing map.

Revision ID: 7639d48204a7
Revises: b7c4d2e91a03
Create Date: 2026-05-31 16:34:02.795767

"""

from alembic import op

revision = "7639d48204a7"
down_revision = "b7c4d2e91a03"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE crm_entity_indexing_map (
            crm_domain_ref_id INTEGER NOT NULL,
            entity_type VARCHAR NOT NULL,
            entity_ref_id INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            object_id VARCHAR NOT NULL,
            revision INTEGER NOT NULL,
            index_method_version INTEGER NOT NULL,
            CONSTRAINT fk_crm_entity_indexing_map_crm_domain_ref_id
                FOREIGN KEY (crm_domain_ref_id) REFERENCES crm_domain (ref_id),
            CONSTRAINT uq_crm_entity_indexing_map_crm_domain_entity
                UNIQUE (crm_domain_ref_id, entity_type, entity_ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_crm_entity_indexing_map_crm_domain_entity_type
            ON crm_entity_indexing_map (crm_domain_ref_id, entity_type)
    """
    )


def downgrade() -> None:
    op.execute("DROP TABLE crm_entity_indexing_map")
