"""Time plan activity target as EntityLink.

Revision ID: 42fc79adebb8
Revises: e8f9a0b1c2d3
Create Date: 2026-04-25 14:52:32.585184

"""

from alembic import op
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = "42fc79adebb8"
down_revision = "e8f9a0b1c2d3"
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


def _has_index(table_name: str, index_name: str) -> bool:
    inspector = inspect(op.get_bind())
    if table_name not in inspector.get_table_names():
        return False
    return any(ix["name"] == index_name for ix in inspector.get_indexes(table_name))


def upgrade() -> None:
    if not _has_table("time_plan_activity"):
        return

    if _has_column("time_plan_activity", "target_ref_id"):
        # Backfill legacy target + target_ref_id into EntityLink wire form.
        op.execute(
            """
            UPDATE time_plan_activity
            SET target =
                CASE target
                    WHEN 'inbox-task' THEN 'InboxTask:std:' || CAST(target_ref_id AS TEXT)
                    WHEN 'big-plan' THEN 'BigPlan:std:' || CAST(target_ref_id AS TEXT)
                    ELSE target
                END
            WHERE target_ref_id IS NOT NULL
            """
        )

        if _has_index(
            "time_plan_activity",
            "ix_time_plan_activity_time_plan_ref_id_target_target_ref_id",
        ):
            op.drop_index(
                "ix_time_plan_activity_time_plan_ref_id_target_target_ref_id",
                table_name="time_plan_activity",
            )
        if _has_index(
            "time_plan_activity", "ix_time_plan_activity_target_target_ref_id"
        ):
            op.drop_index(
                "ix_time_plan_activity_target_target_ref_id",
                table_name="time_plan_activity",
            )

        with op.batch_alter_table("time_plan_activity") as batch_op:
            batch_op.drop_column("target_ref_id")

    # Indexes for EntityLink based target lookups and uniqueness.
    op.execute(
        """
        CREATE UNIQUE INDEX IF NOT EXISTS ix_time_plan_activity_time_plan_ref_id_target
        ON time_plan_activity (time_plan_ref_id, target)
        WHERE archived=0
        """
    )
    op.execute(
        """
        CREATE INDEX IF NOT EXISTS ix_time_plan_activity_target
        ON time_plan_activity (target)
        """
    )


def downgrade() -> None:
    pass
