"""Add note column to search index

Revision ID: de55884c2c52
Revises: b2c4d8e0f1a3
Create Date: 2026-04-12 19:39:55.941069

"""

from alembic import op
from sqlalchemy import inspect


revision = "de55884c2c52"
down_revision = "b2c4d8e0f1a3"
branch_labels = None
depends_on = None


def _has_table(table_name: str) -> bool:
    inspector = inspect(op.get_bind())
    return table_name in inspector.get_table_names()


def _has_column(table_name: str, column_name: str) -> bool:
    inspector = inspect(op.get_bind())
    if table_name not in inspector.get_table_names():
        return False
    return any(
        column["name"] == column_name for column in inspector.get_columns(table_name)
    )


def upgrade() -> None:
    if not _has_table("search_index") or _has_column("search_index", "note"):
        return

    # SQLite (including Apple builds) rejects ALTER TABLE on FTS5; rebuild instead.
    op.execute(
        """
        CREATE VIRTUAL TABLE search_index_new USING fts5(
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
        );
        """
    )
    op.execute(
        """
        INSERT INTO search_index_new
        SELECT
            workspace_ref_id,
            entity_tag,
            parent_ref_id,
            ref_id,
            name,
            '',
            archived,
            created_time,
            last_modified_time,
            archived_time
        FROM search_index;
        """
    )
    op.execute("DROP TABLE search_index")
    op.execute("ALTER TABLE search_index_new RENAME TO search_index")


def downgrade() -> None:
    pass
