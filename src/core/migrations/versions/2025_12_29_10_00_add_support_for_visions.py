"""Add support for visions.

Revision ID: c1d2e3f4a5b6
Revises: b7c8d9e0f1a2
Create Date: 2025-12-29 10:00:00.000000
"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "c1d2e3f4a5b6"
down_revision = "b7c8d9e0f1a2"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE vision (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            life_plan_ref_id INTEGER NOT NULL,
            status VARCHAR NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (life_plan_ref_id) REFERENCES life_plan (ref_id)
        )
    """
    )
    op.execute(
        """
        CREATE INDEX ix_vision_life_plan_ref_id ON vision (life_plan_ref_id)
    """
    )
    # Enforce at most one active vision per life plan that is not archived.
    op.execute(
        """
        CREATE UNIQUE INDEX ix_vision_life_plan_ref_id_active
        ON vision (life_plan_ref_id)
        WHERE archived=0 AND status='active'
    """
    )
    # Enforce at most one draft vision per life plan that is not archived.
    op.execute(
        """
        CREATE UNIQUE INDEX ix_vision_life_plan_ref_id_draft
        ON vision (life_plan_ref_id)
        WHERE archived=0 AND status='draft'
    """
    )

    op.execute(
        """
        CREATE TABLE vision_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES vision (ref_id)
        )
    """
    )


def downgrade() -> None:
    pass
