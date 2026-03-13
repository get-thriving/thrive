"""'Add support for milestones'

Revision ID: 9c5f1b3e2a77
Revises: 43195d274a18
Create Date: 2025-12-25 12:10:00.000000

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "9c5f1b3e2a77"
down_revision = "43195d274a18"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE milestone (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            life_plan_ref_id INTEGER NOT NULL,
            name VARCHAR NOT NULL,
            date DATE NOT NULL,
            aspect_ref_id INTEGER NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (life_plan_ref_id) REFERENCES life_plan (ref_id),
            FOREIGN KEY (aspect_ref_id) REFERENCES aspect (ref_id)
        )
    """
    )
    op.execute(
        """
        CREATE INDEX ix_milestone_life_plan_ref_id ON milestone (life_plan_ref_id)
    """
    )
    op.execute(
        """
        CREATE INDEX ix_milestone_aspect_ref_id ON milestone (aspect_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE milestone_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES milestone (ref_id)
        )
    """
    )


def downgrade() -> None:
    pass
