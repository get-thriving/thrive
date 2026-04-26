"""Composite indexes on (domain/collection ref, owner) for EntityLink owners

Revision ID: d7e8f9a0b1c2
Revises: c3d4e5f6a7b8
Create Date: 2026-04-24 12:00:00.000000

Adds non-unique indexes so queries that scope by workspace (via the single
domain or note collection per workspace) and filter by ``owner`` can use an
index. Tables already have a unique or plain index on ``owner`` alone from
earlier migrations; this complements that for collection/domain + owner access.

"""

from alembic import op
from sqlalchemy import inspect


revision = "d7e8f9a0b1c2"
down_revision = "c3d4e5f6a7b8"
branch_labels = None
depends_on = None


def _has_column(table_name: str, column_name: str) -> bool:
    inspector = inspect(op.get_bind())
    if table_name not in inspector.get_table_names():
        return False
    return any(
        column["name"] == column_name for column in inspector.get_columns(table_name)
    )


def _has_index(table_name: str, index_name: str) -> bool:
    inspector = inspect(op.get_bind())
    if table_name not in inspector.get_table_names():
        return False
    return any(ix["name"] == index_name for ix in inspector.get_indexes(table_name))


def upgrade() -> None:
    if (
        _has_column("note", "note_collection_ref_id")
        and _has_column("note", "owner")
        and not _has_index("note", "ix_note_note_collection_ref_id_owner")
    ):
        op.execute(
            "CREATE INDEX IF NOT EXISTS ix_note_note_collection_ref_id_owner "
            "ON note (note_collection_ref_id, owner)"
        )

    if (
        _has_column("tag_link", "tag_domain_ref_id")
        and _has_column("tag_link", "owner")
        and not _has_index("tag_link", "ix_tag_link_tag_domain_ref_id_owner")
    ):
        op.execute(
            "CREATE INDEX IF NOT EXISTS ix_tag_link_tag_domain_ref_id_owner "
            "ON tag_link (tag_domain_ref_id, owner)"
        )

    if (
        _has_column("contact_link", "contact_domain_ref_id")
        and _has_column("contact_link", "owner")
        and not _has_index(
            "contact_link",
            "ix_contact_link_contact_domain_ref_id_owner",
        )
    ):
        op.execute(
            "CREATE INDEX IF NOT EXISTS ix_contact_link_contact_domain_ref_id_owner "
            "ON contact_link (contact_domain_ref_id, owner)"
        )

    if (
        _has_column("time_event_in_day_block", "time_event_domain_ref_id")
        and _has_column("time_event_in_day_block", "owner")
        and not _has_index(
            "time_event_in_day_block",
            "ix_time_event_in_day_block_time_event_domain_ref_id_owner",
        )
    ):
        op.execute(
            "CREATE INDEX IF NOT EXISTS "
            "ix_time_event_in_day_block_time_event_domain_ref_id_owner "
            "ON time_event_in_day_block (time_event_domain_ref_id, owner)"
        )

    if (
        _has_column("time_event_full_days_block", "time_event_domain_ref_id")
        and _has_column("time_event_full_days_block", "owner")
        and not _has_index(
            "time_event_full_days_block",
            "ix_time_event_full_days_block_time_event_domain_ref_id_owner",
        )
    ):
        op.execute(
            "CREATE INDEX IF NOT EXISTS "
            "ix_time_event_full_days_block_time_event_domain_ref_id_owner "
            "ON time_event_full_days_block (time_event_domain_ref_id, owner)"
        )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_note_note_collection_ref_id_owner")
    op.execute("DROP INDEX IF EXISTS ix_tag_link_tag_domain_ref_id_owner")
    op.execute("DROP INDEX IF EXISTS ix_contact_link_contact_domain_ref_id_owner")
    op.execute(
        "DROP INDEX IF EXISTS ix_time_event_in_day_block_time_event_domain_ref_id_owner"
    )
    op.execute(
        "DROP INDEX IF EXISTS ix_time_event_full_days_block_time_event_domain_ref_id_owner"
    )
