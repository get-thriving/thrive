"""Add link tables between time plans and life plan entities.

Revision ID: a6b7c8d9e0f1
Revises: fec9e643177f
Create Date: 2025-12-28 12:00:00.000000
"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "a6b7c8d9e0f1"
down_revision = "fec9e643177f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE time_plan_chapter_link (
            time_plan_ref_id INTEGER NOT NULL,
            chapter_ref_id INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            PRIMARY KEY (time_plan_ref_id, chapter_ref_id),
            FOREIGN KEY (time_plan_ref_id) REFERENCES time_plan (ref_id),
            FOREIGN KEY (chapter_ref_id) REFERENCES chapter (ref_id)
        )
    """
    )
    op.execute(
        """
        CREATE INDEX ix_time_plan_chapter_link_chapter_ref_id
        ON time_plan_chapter_link (chapter_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE time_plan_aspect_link (
            time_plan_ref_id INTEGER NOT NULL,
            aspect_ref_id INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            PRIMARY KEY (time_plan_ref_id, aspect_ref_id),
            FOREIGN KEY (time_plan_ref_id) REFERENCES time_plan (ref_id),
            FOREIGN KEY (aspect_ref_id) REFERENCES aspect (ref_id)
        )
    """
    )
    op.execute(
        """
        CREATE INDEX ix_time_plan_aspect_link_aspect_ref_id
        ON time_plan_aspect_link (aspect_ref_id)
    """
    )

    op.execute(
        """
        CREATE TABLE time_plan_goal_link (
            time_plan_ref_id INTEGER NOT NULL,
            goal_ref_id INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            PRIMARY KEY (time_plan_ref_id, goal_ref_id),
            FOREIGN KEY (time_plan_ref_id) REFERENCES time_plan (ref_id),
            FOREIGN KEY (goal_ref_id) REFERENCES goal (ref_id)
        )
    """
    )
    op.execute(
        """
        CREATE INDEX ix_time_plan_goal_link_goal_ref_id
        ON time_plan_goal_link (goal_ref_id)
    """
    )


def downgrade() -> None:
    # Intentionally left blank for now (matches many existing migrations in this repo).
    pass
