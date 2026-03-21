"""'Remove some things from inbox tasks'

Revision ID: 3b8613010fee
Revises: 3144d0650804
Create Date: 2026-03-21 18:41:29.776802

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "3b8613010fee"
down_revision = "3144d0650804"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("inbox_task") as batch_op:
        from sqlalchemy import inspect

        conn = op.get_bind()
        inspector = inspect(conn)
        # Get all index names for the current table
        existing_indexes = {ix["name"] for ix in inspector.get_indexes("inbox_task")}
        if "ix_inbox_task_project_ref_id" in existing_indexes:
            batch_op.drop_index("ix_inbox_task_project_ref_id")
        if "ix_inbox_task_aspect_ref_id" in existing_indexes:
            batch_op.drop_index("ix_inbox_task_aspect_ref_id")
        batch_op.drop_index("ix_inbox_task_chapter_ref_id")
        batch_op.drop_index("ix_inbox_task_goal_ref_id")
        batch_op.drop_column("aspect_ref_id")
        batch_op.drop_column("chapter_ref_id")
        batch_op.drop_column("goal_ref_id")

    op.execute(
        "DELETE FROM tag_link_event WHERE owner_ref_id IN "
        "(SELECT ref_id FROM tag_link WHERE namespace = 'inbox-task')"
    )
    op.execute("DELETE FROM tag_link WHERE namespace = 'inbox-task'")

    op.execute(
        "DELETE FROM contact_link_event WHERE owner_ref_id IN "
        "(SELECT ref_id FROM contact_link WHERE namespace = 'inbox-task')"
    )
    op.execute("DELETE FROM contact_link WHERE namespace = 'inbox-task'")

    op.execute(
        "DELETE FROM note_event WHERE owner_ref_id IN "
        "(SELECT ref_id FROM note WHERE namespace = 'inbox-task')"
    )
    op.execute("DELETE FROM note WHERE namespace = 'inbox-task'")

    with op.batch_alter_table("time_plan_domain") as batch_op:
        batch_op.drop_column("planning_task_aspect_ref_id")

    with op.batch_alter_table("prm") as batch_op:
        batch_op.drop_column("catch_up_aspect_ref_id")

    with op.batch_alter_table("person") as batch_op:
        batch_op.drop_column("catch_up_aspect_ref_id")

    with op.batch_alter_table("journal_collection") as batch_op:
        batch_op.drop_column("writing_task_aspect_ref_id")

    with op.batch_alter_table("metric_collection") as batch_op:
        batch_op.drop_column("collection_aspect_ref_id")

    with op.batch_alter_table("metric") as batch_op:
        batch_op.drop_column("collection_aspect_ref_id")

    with op.batch_alter_table("working_mem_collection") as batch_op:
        batch_op.drop_column("cleanup_aspect_ref_id")

    with op.batch_alter_table("slack_task_collection") as batch_op:
        batch_op.drop_column("generation_aspect_ref_id")

    with op.batch_alter_table("email_task_collection") as batch_op:
        batch_op.drop_column("generation_aspect_ref_id")

    with op.batch_alter_table("workspace") as batch_op:
        batch_op.drop_column("default_aspect_ref_id")

    op.execute(
        "UPDATE journal_stats SET report = REPLACE(report, '\"user\"', '\"todo\"')"
    )


def downgrade():
    pass
