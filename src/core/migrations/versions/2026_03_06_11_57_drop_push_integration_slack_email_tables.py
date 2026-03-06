"""Drop push integration, slack task, and email task tables

Revision ID: f7a9d3e2b8c1
Revises: c8aa3ea7a4d1
Create Date: 2026-03-06 11:57:00.000000

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "f7a9d3e2b8c1"
down_revision = "c8aa3ea7a4d1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Delete inbox tasks that were generated from slack or email tasks
    op.execute(
        """
        DELETE FROM inbox_task 
        WHERE source IN ('slack-task', 'email-task')
        """
    )
    
    # Drop event tables first (they have foreign keys to main tables)
    op.execute("""DROP TABLE IF EXISTS slack_task_event""")
    op.execute("""DROP TABLE IF EXISTS email_task_event""")
    
    # Drop main entity tables (they have foreign keys to collection tables)
    op.execute("""DROP TABLE IF EXISTS slack_task""")
    op.execute("""DROP TABLE IF EXISTS email_task""")
    
    # Drop collection event tables
    op.execute("""DROP TABLE IF EXISTS slack_task_collection_event""")
    op.execute("""DROP TABLE IF EXISTS email_task_collection_event""")
    
    # Drop collection tables (they have foreign keys to push_integration_group)
    op.execute("""DROP TABLE IF EXISTS slack_task_collection""")
    op.execute("""DROP TABLE IF EXISTS email_task_collection""")
    
    # Drop push integration group tables
    op.execute("""DROP TABLE IF EXISTS push_integration_group_event""")
    op.execute("""DROP TABLE IF EXISTS push_integration_group""")


def downgrade() -> None:
    # No downgrade - this is a permanent removal of deprecated functionality
    pass
