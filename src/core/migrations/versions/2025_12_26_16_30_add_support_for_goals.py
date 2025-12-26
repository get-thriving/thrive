"""'Add support for goals'

Revision ID: f1a2b3c4d5e6
Revises: cda51dbea5ee
Create Date: 2025-12-26 16:30:00.000000

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "f1a2b3c4d5e6"
down_revision = "cda51dbea5ee"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE goal (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            life_plan_ref_id INTEGER NOT NULL,
            name VARCHAR NOT NULL,
            project_ref_id INTEGER NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (life_plan_ref_id) REFERENCES life_plan (ref_id),
            FOREIGN KEY (project_ref_id) REFERENCES project (ref_id)
        )
    """
    )
    op.execute(
        """
        CREATE INDEX ix_goal_life_plan_ref_id ON goal (life_plan_ref_id)
    """
    )
    op.execute(
        """
        CREATE INDEX ix_goal_project_ref_id ON goal (project_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE goal_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES goal (ref_id)
        )
    """
    )


def downgrade() -> None:
    pass
