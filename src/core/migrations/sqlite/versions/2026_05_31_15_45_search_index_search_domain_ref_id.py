"""Search index search domain ref id.

Revision ID: 22846a7f1925
Revises: 3ce25ef103a3
Create Date: 2026-05-31 15:45:23.478100

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy import text

revision = "22846a7f1925"
down_revision = "3ce25ef103a3"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()

    with op.batch_alter_table("search_index_tag") as batch_op:
        batch_op.add_column(
            sa.Column("search_domain_ref_id", sa.Integer(), nullable=True)
        )

    conn.execute(
        text(
            """
            UPDATE search_index_tag
            SET search_domain_ref_id = (
                SELECT search_domain.ref_id
                FROM search_domain
                WHERE search_domain.workspace_ref_id = search_index_tag.workspace_ref_id
            )
            """
        )
    )

    with op.batch_alter_table("search_index_tag") as batch_op:
        batch_op.alter_column("search_domain_ref_id", nullable=False)
        batch_op.create_foreign_key(
            "fk_search_index_tag_search_domain_ref_id",
            "search_domain",
            ["search_domain_ref_id"],
            ["ref_id"],
        )

    with op.batch_alter_table("search_index_contact") as batch_op:
        batch_op.add_column(
            sa.Column("search_domain_ref_id", sa.Integer(), nullable=True)
        )

    conn.execute(
        text(
            """
            UPDATE search_index_contact
            SET search_domain_ref_id = (
                SELECT search_domain.ref_id
                FROM search_domain
                WHERE search_domain.workspace_ref_id
                    = search_index_contact.workspace_ref_id
            )
            """
        )
    )

    with op.batch_alter_table("search_index_contact") as batch_op:
        batch_op.alter_column("search_domain_ref_id", nullable=False)
        batch_op.create_foreign_key(
            "fk_search_index_contact_search_domain_ref_id",
            "search_domain",
            ["search_domain_ref_id"],
            ["ref_id"],
        )

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
            archived UNINDEXED,
            created_time,
            last_modified_time,
            archived_time,
            tokenize="porter unicode61 remove_diacritics 1"
        )
    """
    )

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
                archived,
                created_time,
                last_modified_time,
                archived_time
            )
            SELECT
                search_index.workspace_ref_id,
                search_domain.ref_id,
                search_index.entity_tag,
                search_index.parent_ref_id,
                search_index.ref_id,
                search_index.name,
                search_index.note,
                search_index.archived,
                search_index.created_time,
                search_index.last_modified_time,
                search_index.archived_time
            FROM search_index
            JOIN search_domain
                ON search_domain.workspace_ref_id = search_index.workspace_ref_id
            """
        )
    )

    op.execute('DROP TABLE "search_index"')
    op.execute('ALTER TABLE search_index_new RENAME TO "search_index"')

    op.execute("PRAGMA foreign_keys=ON")


def downgrade() -> None:
    conn = op.get_bind()

    op.execute("PRAGMA foreign_keys=OFF")

    op.execute(
        """
        CREATE VIRTUAL TABLE search_index_old USING fts5(
            workspace_ref_id,
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

    conn.execute(
        text(
            """
            INSERT INTO search_index_old (
                workspace_ref_id,
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

    with op.batch_alter_table("search_index_contact") as batch_op:
        batch_op.drop_constraint(
            "fk_search_index_contact_search_domain_ref_id",
            type_="foreignkey",
        )
        batch_op.drop_column("search_domain_ref_id")

    with op.batch_alter_table("search_index_tag") as batch_op:
        batch_op.drop_constraint(
            "fk_search_index_tag_search_domain_ref_id",
            type_="foreignkey",
        )
        batch_op.drop_column("search_domain_ref_id")
