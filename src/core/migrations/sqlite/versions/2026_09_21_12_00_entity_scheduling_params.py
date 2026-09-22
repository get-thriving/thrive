"""entity scheduling params

Revision ID: e0f1a2b3c4d5
Revises: d9e0f1a2b3c4
Create Date: 2026-09-21 12:00:00.000000

"""

from alembic import op

revision = "e0f1a2b3c4d5"
down_revision = "d9e0f1a2b3c4"
branch_labels = None
depends_on = None

# Every entity that can own inbox tasks carries scheduling params. Anything
# schedulable takes up real time, so it always carries a duration and at least
# one event; existing rows get the default half hour, once.
DEFAULT_SCHEDULING_PARAMS = (
    '{"schedulability": "schedulable", ' '"event_duration_mins": 30, "event_count": 1}'
)

TABLES_AND_COLUMNS = [
    ("habit", "scheduling_params"),
    ("chore", "scheduling_params"),
    ("big_plan", "scheduling_params"),
    ("todo_task", "scheduling_params"),
    ("metric", "scheduling_params"),
    ("person", "scheduling_params"),
    ("occasion", "scheduling_params"),
    ("slack_task", "scheduling_params"),
    ("email_task", "scheduling_params"),
    ("working_mem_collection", "cleanup_task_scheduling_params"),
    ("journal_collection", "writing_task_scheduling_params"),
    ("time_plan_domain", "planning_task_scheduling_params"),
    ("life_plan", "eval_task_scheduling_params"),
]


def upgrade() -> None:
    for table, column in TABLES_AND_COLUMNS:
        op.execute(
            f"ALTER TABLE {table} ADD COLUMN {column} JSON NOT NULL "
            f"DEFAULT '{DEFAULT_SCHEDULING_PARAMS}'"
        )


def downgrade() -> None:
    for table, column in reversed(TABLES_AND_COLUMNS):
        op.execute(f"ALTER TABLE {table} DROP COLUMN {column}")
