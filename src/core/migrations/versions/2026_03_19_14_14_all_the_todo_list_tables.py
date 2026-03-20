"""'All the todo list tables'

Revision ID: 794ae553e53d
Revises: c3e875ac8f62
Create Date: 2026-03-19 14:14:09.301635

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "794ae553e53d"
down_revision = "c3e875ac8f62"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE todo_domain (
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
        CREATE UNIQUE INDEX ix_todo_domain_workspace_ref_id ON todo_domain (workspace_ref_id)
        """
    )
    op.execute(
        """
        CREATE TABLE todo_domain_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES todo_domain (ref_id)
        )
        """
    )

    op.execute(
        """
        CREATE TABLE todo_task (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            todo_domain_ref_id INTEGER NOT NULL,
            name VARCHAR(255) NOT NULL,
            aspect_ref_id INTEGER NOT NULL,
            chapter_ref_id INTEGER,
            goal_ref_id INTEGER,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (todo_domain_ref_id) REFERENCES todo_domain (ref_id)
        )
        """
    )
    op.execute(
        """
        CREATE TABLE todo_task_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES todo_task (ref_id)
        )
        """
    )

    op.execute(
        """
        INSERT INTO todo_domain
               SELECT
                   ref_id as ref_id,
                   1 as version,
                   archived as archived,
                   archival_reason as archival_reason,
                   created_time as created_time,
                   last_modified_time as last_modified_time,
                   archived_time as archived_time,
                   ref_id as workspace_ref_id
               FROM workspace;
        """
    )
    op.execute(
        """
        INSERT INTO todo_domain_event
               SELECT
                   ref_id as owner_ref_id,
                   created_time as timestamp,
                   0 as session_index,
                   'Created' as name,
                   'Cli' as source,
                   1 as owner_version,
                   'Created' as kind,
                   '{}' as data
               FROM todo_domain;
        """
    )


def downgrade() -> None:
    op.execute("""DROP TABLE IF EXISTS todo_task_event""")
    op.execute("""DROP TABLE IF EXISTS todo_task""")
    op.execute("""DROP TABLE IF EXISTS todo_domain_event""")
    op.execute("""DROP TABLE IF EXISTS todo_domain""")
