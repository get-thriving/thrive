"""repair scheduling params hints

Revision ID: f1a2b3c4d5e6
Revises: e0f1a2b3c4d5
Create Date: 2026-09-22 10:00:00.000000

"""

from alembic import op

revision = "f1a2b3c4d5e6"
down_revision = "e0f1a2b3c4d5"
branch_labels = None
depends_on = None

# An earlier cut of e0f1a2b3c4d5 filled the new columns with schedulable params
# carrying no duration and no count, back when both were optional. They are
# required of anything schedulable now, so a database that ran that cut holds
# rows the domain refuses to load - and alembic records revisions, not their
# contents, so the corrected backfill never reaches it. Repair those rows here.
#
# A database that ran e0f1a2b3c4d5 as it now stands has none of them, and this
# is a no-op.
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


def _by_difficulty(difficulty: str) -> str:
    """Pick the params matching the difficulty the expression yields."""
    whens = " ".join(
        f"WHEN '{name}' THEN '{_params(mins)}'"
        for name, mins in EVENT_DURATION_MINS_BY_DIFFICULTY.items()
    )
    return (
        f"CASE {difficulty} {whens} "
        f"ELSE '{_params(DEFAULT_EVENT_DURATION_MINS)}' END"
    )


def _from_json(column: str) -> str:
    """The difficulty inside a JSON gen params column."""
    return f"json_extract({column}, '$.difficulty')"


def _is_missing_a_hint(column: str) -> str:
    """Whether the params are schedulable but short of a hint."""
    return (
        f"json_extract({column}, '$.schedulability') = 'schedulable' "
        f"AND (json_extract({column}, '$.event_duration_mins') IS NULL "
        f"OR json_extract({column}, '$.event_count') IS NULL)"
    )


# The same sources the backfill in e0f1a2b3c4d5 reads.
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
    ("occasion", "scheduling_params", f"'{_params(EASY_EVENT_DURATION_MINS)}'"),
    (
        "slack_task",
        "scheduling_params",
        _by_difficulty(_from_json("generation_extra_info")),
    ),
    (
        "email_task",
        "scheduling_params",
        _by_difficulty(_from_json("generation_extra_info")),
    ),
    (
        "working_mem_collection",
        "cleanup_task_scheduling_params",
        f"'{_params(EASY_EVENT_DURATION_MINS)}'",
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
        _by_difficulty(_from_json("eval_task_gen_params")),
    ),
]


def upgrade() -> None:
    for table, column, params in TABLES_COLUMNS_AND_PARAMS:
        op.execute(
            f"UPDATE {table} SET {column} = {params} "
            f"WHERE {_is_missing_a_hint(column)}"
        )


def downgrade() -> None:
    # The rows this repairs were never meant to exist, so there is nothing to
    # put back.
    pass
