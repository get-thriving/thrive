"""'Rename inbox task source column to namespace'

Revision ID: 1121d280b5c3
Revises: 338cd79a9bb0
Create Date: 2026-04-08 22:43:11.424184

"""

from alembic import op
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = "1121d280b5c3"
down_revision = "338cd79a9bb0"
branch_labels = None
depends_on = None


def _has_index(table_name: str, index_name: str) -> bool:
    inspector = inspect(op.get_bind())
    if table_name not in inspector.get_table_names():
        return False
    return any(ix["name"] == index_name for ix in inspector.get_indexes(table_name))


def upgrade() -> None:
    if _has_index("inbox_task", "ix_inbox_task_pagination"):
        op.drop_index("ix_inbox_task_pagination", table_name="inbox_task")
    with op.batch_alter_table("inbox_task") as batch_op:
        batch_op.alter_column("source", new_column_name="namespace")
    op.execute(
        "CREATE INDEX ix_inbox_task_pagination ON inbox_task "
        "(inbox_task_collection_ref_id, namespace, created_time);"
    )


def downgrade() -> None:
    if _has_index("inbox_task", "ix_inbox_task_pagination"):
        op.drop_index("ix_inbox_task_pagination", table_name="inbox_task")
    with op.batch_alter_table("inbox_task") as batch_op:
        batch_op.alter_column("namespace", new_column_name="source")
    op.execute(
        "CREATE INDEX ix_inbox_task_pagination ON inbox_task "
        "(inbox_task_collection_ref_id, source, created_time);"
    )
