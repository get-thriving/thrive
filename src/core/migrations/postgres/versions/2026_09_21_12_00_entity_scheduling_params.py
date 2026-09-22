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
# one event. Existing rows get one event, as long as the difficulty of the work
# they generate suggests - the same thing new entities now get.
EVENT_DURATION_MINS_BY_DIFFICULTY = {
    "easy": 15,
    "medium": 30,
    "hard": 60,
}
DEFAULT_EVENT_DURATION_MINS = EVENT_DURATION_MINS_BY_DIFFICULTY["medium"]
EASY_EVENT_DURATION_MINS = EVENT_DURATION_MINS_BY_DIFFICULTY["easy"]


def _params(event_duration_mins: int) -> str:
    """The stored params for one event of a given length."""
    return (
        '{"schedulability": "schedulable", '
        f'"event_duration_mins": {event_duration_mins}, "event_count": 1}}'
    )


def _params_literal(event_duration_mins: int) -> str:
    """The params as a jsonb literal.

    A bare string literal on its own is coerced to whatever the column holds,
    but the branches of a CASE settle on text between them, and postgres
    refuses to assign text to a jsonb column. So the cast has to be spelled
    out.
    """
    return f"'{_params(event_duration_mins)}'::jsonb"


def _by_difficulty(difficulty: str) -> str:
    """Pick the params matching the difficulty the expression yields."""
    whens = " ".join(
        f"WHEN '{name}' THEN {_params_literal(mins)}"
        for name, mins in EVENT_DURATION_MINS_BY_DIFFICULTY.items()
    )
    return (
        f"CASE {difficulty} {whens} "
        f"ELSE {_params_literal(DEFAULT_EVENT_DURATION_MINS)} END"
    )


def _from_json(column: str) -> str:
    """The difficulty inside a JSONB gen params column."""
    return f"{column} ->> 'difficulty'"


def _from_json_text(column: str) -> str:
    """The difficulty inside a gen params column kept as text."""
    return f"{column}::jsonb ->> 'difficulty'"


# The column each owner type gets, and where the difficulty of the work it
# generates is stored. A type that has no difficulty of its own always
# generates easy work, so it is given that outright.
TABLES_COLUMNS_AND_PARAMS = [
    ("habit", "scheduling_params", _by_difficulty(_from_json("gen_params"))),
    ("chore", "scheduling_params", _by_difficulty(_from_json("gen_params"))),
    ("big_plan", "scheduling_params", _by_difficulty("difficulty")),
    (
        "todo_task",
        "scheduling_params",
        _by_difficulty(
            "(SELECT inbox_task.difficulty FROM inbox_task "
            "WHERE inbox_task.owner = 'TodoTask:std:' || todo_task.ref_id "
            "ORDER BY inbox_task.ref_id LIMIT 1)"
        ),
    ),
    ("metric", "scheduling_params", _by_difficulty(_from_json("collection_params"))),
    ("person", "scheduling_params", _by_difficulty(_from_json("catch_up_params"))),
    ("occasion", "scheduling_params", _params_literal(EASY_EVENT_DURATION_MINS)),
    (
        "slack_task",
        "scheduling_params",
        _by_difficulty(_from_json_text("generation_extra_info")),
    ),
    (
        "email_task",
        "scheduling_params",
        _by_difficulty(_from_json_text("generation_extra_info")),
    ),
    (
        "working_mem_collection",
        "cleanup_task_scheduling_params",
        _params_literal(EASY_EVENT_DURATION_MINS),
    ),
    (
        "journal_collection",
        "writing_task_scheduling_params",
        _by_difficulty(_from_json("writing_task_gen_params")),
    ),
    (
        "time_plan_domain",
        "planning_task_scheduling_params",
        _by_difficulty(_from_json("planning_task_gen_params")),
    ),
    (
        "life_plan",
        "eval_task_scheduling_params",
        _by_difficulty(_from_json_text("eval_task_gen_params")),
    ),
]


def upgrade() -> None:
    for table, column, params in TABLES_COLUMNS_AND_PARAMS:
        op.execute(
            f"ALTER TABLE {table} ADD COLUMN {column} JSONB NOT NULL "
            f"DEFAULT '{_params(DEFAULT_EVENT_DURATION_MINS)}'"
        )
        op.execute(f"UPDATE {table} SET {column} = {params}")


def downgrade() -> None:
    for table, column, _ in reversed(TABLES_COLUMNS_AND_PARAMS):
        op.execute(f"ALTER TABLE {table} DROP COLUMN {column}")
