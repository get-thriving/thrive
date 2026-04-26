"""Enable todo-task workspace feature flag for all workspaces.

Revision ID: e5b1c2930a2d
Revises: 7c4b9a2d8f01
Create Date: 2026-04-26 14:00:00.000000

``WorkspaceFeature.TODO_TASK`` (wire key ``todo-task``) was added with a default
of off in ``BASIC_WORKSPACE_FEATURE_FLAGS``. Existing rows keep whatever JSON
they already had; this migration sets ``"todo-task": true`` on every workspace
so the dedicated to-do feature is on everywhere, matching product intent.
"""

from alembic import op
from sqlalchemy import inspect


revision = "e5b1c2930a2d"
down_revision = "7c4b9a2d8f01"
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
    if not (_has_table("workspace") and _has_column("workspace", "feature_flags")):
        return

    op.execute(
        """
        UPDATE workspace
        SET feature_flags = json_set(
            COALESCE(feature_flags, json('{}')),
            '$.todo-task',
            true
        )
        """
    )


def downgrade() -> None:
    if not (_has_table("workspace") and _has_column("workspace", "feature_flags")):
        return

    op.execute(
        """
        UPDATE workspace
        SET feature_flags = json_remove(feature_flags, '$.todo-task')
        WHERE feature_flags IS NOT NULL
          AND json_type(feature_flags, '$.todo-task') IS NOT NULL
        """
    )
