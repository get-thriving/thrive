"""finish rename big plan to project

Revision ID: c1d5e93a7b26
Revises: f3a91c62d70e
Create Date: 2026-08-29 18:00:00.000000

``f3a91c62d70e`` renamed the ``BigPlan`` entity family to ``Project``, but it
missed a handful of columns that also carry the old name as *data*:

* ``journal_stats.report`` is a serialized ``ReportPeriodResult``. Its field
  names changed with the rename (``global_big_plans_summary`` ->
  ``global_projects_summary``, ``per_big_plan_breakdown`` ->
  ``per_project_breakdown``, ``not_done_big_plans`` -> ``not_done_projects``,
  ...) and it embeds ``BigPlan:std`` source tags and ``big_plan_cnt`` counters.
  Left alone, every journal that has stats fails to load with
  ``Expected value of type ReportPeriodResult to have field
  global_projects_summary``.

* ``time_plan_activity.target`` holds an ``EntityLink`` wire string such as
  ``BigPlan:std:12``, not the kebab-case ``big-plan`` the previous migration
  matched on, so it was never rewritten. Left alone, an activity that targets a
  project silently resolves to nothing.

* ``mutation_invocation_record.name`` / ``.args`` keep the undo/redo history of
  each invocation, with names like ``BigPlanCreateUseCase`` and args that embed
  the old identifiers.

* ``time_plan_activity.name`` and ``stats_log_entry.name`` are generated
  display strings ("Work on big-plan 12", "Stats Log Entry for ...,big-plans,
  ... at 2026-08-29") that still read as the old name.

Every step is guarded on the table and column being present and is a plain
token substitution, so this is idempotent and a no-op on a database that has
nothing left to rewrite.

As in the original rename, user-authored free text is left alone: only the
separator-bearing forms (``BigPlan``, ``big_plan``, ``big-plan``) are rewritten,
never the prose form ``big plan``.
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "c1d5e93a7b26"
down_revision = "f3a91c62d70e"
branch_labels = None
depends_on = None


# Columns holding an entity type name ("BigPlan") or an EntityLink wire string
# ("BigPlan:std:12"), missed by the original rename.
PASCAL_COLUMNS: list[tuple[str, str]] = [
    ("time_plan_activity", "target"),
    ("mutation_invocation_record", "name"),
]

# Generated display strings that embed the kebab-case name. Longest first, so
# the plural form is not left as "projects" + a dangling "s".
TEXT_COLUMN_TOKENS: list[tuple[str, str, list[tuple[str, str]]]] = [
    (
        "time_plan_activity",
        "name",
        [("big-plans", "projects"), ("big-plan", "project")],
    ),
    ("stats_log_entry", "name", [("big-plans", "projects"), ("big-plan", "project")]),
]

# JSON columns that can embed any of the above forms, missed by the original
# rename.
JSON_COLUMNS: list[tuple[str, str]] = [
    ("journal_stats", "report"),
    ("mutation_invocation_record", "args"),
]

# Applied to raw JSON text, longest first. The prose form "big plan" is
# intentionally absent so user-authored names are never touched.
JSON_TOKENS: list[tuple[str, str]] = [
    ("key-big-plans-progress", "key-projects-progress"),
    ("BigPlan", "Project"),
    ("big_plans", "projects"),
    ("big_plan", "project"),
    ("big-plans", "projects"),
    ("big-plan", "project"),
]


def _tables(conn: sa.engine.Connection) -> set[str]:
    return set(sa.inspect(conn).get_table_names())


def _columns(conn: sa.engine.Connection, table: str) -> set[str]:
    try:
        return {c["name"] for c in sa.inspect(conn).get_columns(table)}
    except sa.exc.NoSuchTableError:
        return set()


def _quote(identifier: str) -> str:
    return '"' + identifier.replace('"', '""') + '"'


def _replace_in_columns(
    conn: sa.engine.Connection,
    columns: list[tuple[str, str]],
    old: str,
    new: str,
) -> None:
    tables = _tables(conn)
    for table, column in columns:
        if table not in tables or column not in _columns(conn, table):
            continue
        op.execute(
            sa.text(
                f"UPDATE {_quote(table)} "
                f"SET {_quote(column)} = REPLACE({_quote(column)}, :old, :new) "
                f"WHERE {_quote(column)} LIKE :pattern"
            ).bindparams(old=old, new=new, pattern=f"%{old}%")
        )


def _replace_tokens_in_text_columns(
    conn: sa.engine.Connection,
    specs: list[tuple[str, str, list[tuple[str, str]]]],
) -> None:
    for table, column, tokens in specs:
        for old, new in tokens:
            _replace_in_columns(conn, [(table, column)], old, new)


def _rewrite_json_columns(
    conn: sa.engine.Connection,
    columns: list[tuple[str, str]],
    tokens: list[tuple[str, str]],
) -> None:
    """Rewrite embedded identifiers inside JSON columns.

    Done as a text substitution on the serialized JSON: the tokens are plain
    ASCII and only ever appear inside JSON string values or keys, so this
    cannot change the document structure.
    """
    tables = _tables(conn)
    is_postgres = conn.dialect.name == "postgresql"
    for table, column in columns:
        if table not in tables or column not in _columns(conn, table):
            continue
        quoted = _quote(column)
        as_text = f"CAST({quoted} AS TEXT)" if is_postgres else quoted
        for old, new in tokens:
            replaced = f"REPLACE({as_text}, :old, :new)"
            if is_postgres:
                replaced = f"CAST({replaced} AS JSONB)"
            op.execute(
                sa.text(
                    f"UPDATE {_quote(table)} SET {quoted} = {replaced} "
                    f"WHERE {as_text} LIKE :pattern"
                ).bindparams(old=old, new=new, pattern=f"%{old}%")
            )


def upgrade() -> None:
    conn = op.get_bind()

    _replace_in_columns(conn, PASCAL_COLUMNS, "BigPlan", "Project")
    _replace_tokens_in_text_columns(conn, TEXT_COLUMN_TOKENS)
    _rewrite_json_columns(conn, JSON_COLUMNS, JSON_TOKENS)


def downgrade() -> None:
    conn = op.get_bind()

    _rewrite_json_columns(
        conn, JSON_COLUMNS, [(new, old) for old, new in reversed(JSON_TOKENS)]
    )
    _replace_tokens_in_text_columns(
        conn,
        [
            (table, column, [(new, old) for old, new in reversed(tokens)])
            for table, column, tokens in TEXT_COLUMN_TOKENS
        ],
    )
    _replace_in_columns(conn, PASCAL_COLUMNS, "Project", "BigPlan")
