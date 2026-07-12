"""search index visible to

Revision ID: eed3559f70f5
Revises: 254e4cf74fe5
Create Date: 2026-07-10 23:16:43.164692

"""

from alembic import op

revision = "eed3559f70f5"
down_revision = "254e4cf74fe5"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE search_index_visible_to (
            workspace_ref_id INTEGER NOT NULL,
            search_domain_ref_id INTEGER NOT NULL,
            entity_tag VARCHAR NOT NULL,
            entity_ref_id INTEGER NOT NULL,
            user_ref_id INTEGER NOT NULL,
            PRIMARY KEY (
                workspace_ref_id,
                entity_tag,
                entity_ref_id,
                user_ref_id
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
        CREATE INDEX ix_search_index_visible_to_user_workspace
            ON search_index_visible_to (user_ref_id, workspace_ref_id)
        """
    )
    op.execute(
        """
        CREATE INDEX ix_search_index_visible_to_entity
            ON search_index_visible_to (
                workspace_ref_id,
                entity_tag,
                entity_ref_id
            )
        """
    )
    op.execute(
        """
        CREATE INDEX ix_access_status_entity
            ON access_status (entity)
        """
    )


def downgrade() -> None:
    op.execute("DROP INDEX ix_access_status_entity")
    op.execute("DROP INDEX ix_search_index_visible_to_entity")
    op.execute("DROP INDEX ix_search_index_visible_to_user_workspace")
    op.execute("DROP TABLE search_index_visible_to")
