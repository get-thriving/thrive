"""Add habit streak inactive periods

Revision ID: 6945a5af9aa9
Revises: 5346a0ebce82
Create Date: 2026-09-27 19:03:34.529322

"""

from alembic import op

revision = "6945a5af9aa9"
down_revision = "5346a0ebce82"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE habit_streak_inactive_period (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            archival_reason VARCHAR,
            name VARCHAR(100) NOT NULL,
            habit_ref_id INTEGER NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            reason VARCHAR,
            CONSTRAINT pk_habit_streak_inactive_period PRIMARY KEY (ref_id),
            CONSTRAINT fk_habit_streak_inactive_period_habit_ref_id_habit
                FOREIGN KEY (habit_ref_id) REFERENCES habit (ref_id)
        )
        """
    )
    op.execute(
        """
        CREATE INDEX ix_habit_streak_inactive_period_habit_ref_id
            ON habit_streak_inactive_period (habit_ref_id)
        """
    )


def downgrade() -> None:
    op.execute("DROP INDEX ix_habit_streak_inactive_period_habit_ref_id")
    op.execute("DROP TABLE habit_streak_inactive_period")
