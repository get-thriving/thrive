"""'Tables for task domain and task'

Revision ID: a5e6d7f8c9d0
Revises: f7a9d3e2b8c1
Create Date: 2026-03-06 14:00:00.000000

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "a5e6d7f8c9d0"
down_revision = "f7a9d3e2b8c1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE task_domain (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            workspace_ref_id INTEGER NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (workspace_ref_id) REFERENCES workspace (ref_id)
        )
        """
    )
    op.execute(
        """
        CREATE UNIQUE INDEX ix_task_domain_workspace_ref_id ON task_domain (workspace_ref_id)
        """
    )
    op.execute(
        """
        CREATE TABLE task_domain_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES task_domain (ref_id)
        )
        """
    )

    op.execute(
        """
        CREATE TABLE task (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            task_domain_ref_id INTEGER NOT NULL,
            namespace VARCHAR(32) NOT NULL,
            source_entity_ref_id INTEGER NOT NULL,
            name VARCHAR(255) NOT NULL,
            status VARCHAR(32) NOT NULL,
            is_key BOOLEAN NOT NULL,
            eisen VARCHAR(32) NOT NULL,
            difficulty VARCHAR(32) NOT NULL,
            actionable_date DATE,
            due_date DATE,
            recurring_timeline VARCHAR(255),
            recurring_repeat_index INTEGER,
            recurring_gen_right_now DATETIME,
            working_time DATETIME,
            completed_time DATETIME,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (task_domain_ref_id) REFERENCES task_domain (ref_id)
        )
        """
    )
    op.execute(
        """
        CREATE INDEX ix_task_task_domain_ref_id ON task (task_domain_ref_id)
        """
    )
    op.execute(
        """
        CREATE TABLE task_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES task (ref_id)
        )
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS task_event")
    op.execute("DROP TABLE IF EXISTS task")
    op.execute("DROP TABLE IF EXISTS task_domain_event")
    op.execute("DROP TABLE IF EXISTS task_domain")
