"""rename big plan to project

Revision ID: f3a91c62d70e
Revises: b7c4e5f2a318
Create Date: 2026-08-29 12:00:00.000000

The ``BigPlan`` entity family was renamed to ``Project``. Table names are
derived from entity class names (``inflection.underscore(cls.__name__)``), so
the rename moves ``big_plan`` -> ``project``, ``big_plan_collection`` ->
``project_collection``, ``big_plan_stats`` -> ``project_stats`` and
``big_plan_milestone`` -> ``project_milestone``, along with their foreign key
columns and indexes.

Several columns also store the old name as *data*: entity type tags in the
search and mutation-event tables, ``EntityLink`` wire strings of the form
``BigPlan:std:12``, and a handful of kebab-case enum values.

Every step is guarded on the old object actually being present, so this
migration is a no-op on a database created fresh from the initial reset
migration (which already uses the new names).

User-authored free text is deliberately left alone: only the separator-bearing
forms (``BigPlan``, ``big_plan``, ``big-plan``) are rewritten, never the
prose form ``big plan``.

One cosmetic difference remains on SQLite: inline constraint names stay as
``pk_big_plan`` / ``fk_big_plan_*``, because SQLite stores them inside the
table DDL and renaming them means rebuilding the table. They are never
referenced by name there. On PostgreSQL, where constraints are first-class
objects, they are renamed properly.
"""

from __future__ import annotations

import re

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "f3a91c62d70e"
down_revision = "b7c4e5f2a318"
branch_labels = None
depends_on = None


TABLE_RENAMES: list[tuple[str, str]] = [
    ("big_plan_collection", "project_collection"),
    ("big_plan", "project"),
    ("big_plan_stats", "project_stats"),
    ("big_plan_milestone", "project_milestone"),
]

# (table after rename, old column, new column)
COLUMN_RENAMES: list[tuple[str, str, str]] = [
    ("project", "big_plan_collection_ref_id", "project_collection_ref_id"),
    ("project_stats", "big_plan_ref_id", "project_ref_id"),
    ("project_milestone", "big_plan_ref_id", "project_ref_id"),
    ("gamification_score_stats", "big_plan_cnt", "project_cnt"),
    ("gamification_score_period_best", "big_plan_cnt", "project_cnt"),
    ("stats_log_entry", "filter_big_plan_ref_ids", "filter_project_ref_ids"),
]

INDEXED_TABLES: tuple[str, ...] = (
    "project_collection",
    "project",
    "project_stats",
    "project_milestone",
)

# Columns holding an entity type name ("BigPlan") or an EntityLink wire string
# ("BigPlan:std:12"). A plain substring swap covers both, and also covers
# "BigPlanMilestone" / "BigPlanCollection" without a separate rule.
PASCAL_COLUMNS: list[tuple[str, str]] = [
    ("mutation_entity_event", "entity_type"),
    ("search_entity_indexing_map", "entity_type"),
    ("crm_entity_indexing_map", "entity_type"),
    ("search_mutation_log", "entity_type"),
    ("search_index", "entity_tag"),
    ("search_index_tag", "entity_tag"),
    ("search_index_contact", "entity_tag"),
    ("search_index_visible_to", "entity_tag"),
    ("inbox_task", "owner"),
    ("note", "owner"),
    ("tag_link", "owner"),
    ("contact_link", "owner"),
    ("time_event_in_day_block", "owner"),
    ("time_event_full_days_block", "owner"),
    ("publish_entity", "owner"),
    ("access_status", "entity"),
    ("access_grant", "entity"),
    ("access_request", "entity"),
]

# Columns holding a snake_case identifier (entity event method names).
SNAKE_COLUMNS: list[tuple[str, str]] = [
    ("mutation_entity_event", "name"),
]

# Columns holding a single kebab-case enum value, matched exactly.
SCALAR_VALUE_UPDATES: list[tuple[str, str, str, str]] = [
    ("gamification_score_log_entry", "source", "big-plan", "project"),
    ("time_plan_activity", "target", "big-plan", "project"),
    (
        "home_widget",
        "the_type",
        "key-big-plans-progress",
        "key-projects-progress",
    ),
]

# JSON columns that can embed any of the above forms.
JSON_COLUMNS: list[tuple[str, str]] = [
    ("workspace", "feature_flags"),
    ("user", "feature_flags"),
    ("gc_log_entry", "gc_targets"),
    ("gc_log_entry", "entity_records"),
    ("gen_log_entry", "gen_targets"),
    ("gen_log_entry", "entity_created_records"),
    ("gen_log_entry", "entity_updated_records"),
    ("gen_log_entry", "entity_removed_records"),
    ("stats_log_entry", "stats_targets"),
    ("stats_log_entry", "entity_records"),
    ("mutation_entity_event", "data"),
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


def _rename_tables(conn: sa.engine.Connection, pairs: list[tuple[str, str]]) -> None:
    for old, new in pairs:
        tables = _tables(conn)
        if old in tables and new not in tables:
            op.execute(f"ALTER TABLE {_quote(old)} RENAME TO {_quote(new)}")


def _rename_columns(
    conn: sa.engine.Connection, triples: list[tuple[str, str, str]]
) -> None:
    for table, old, new in triples:
        if table not in _tables(conn):
            continue
        cols = _columns(conn, table)
        if old in cols and new not in cols:
            op.execute(
                f"ALTER TABLE {_quote(table)} "
                f"RENAME COLUMN {_quote(old)} TO {_quote(new)}"
            )


def _rename_indexes(conn: sa.engine.Connection, old: str, new: str) -> None:
    """Rename indexes whose name still embeds the old entity name.

    SQLite cannot rename an index, so it is dropped and recreated from its own
    stored DDL with only the index identifier substituted. Rebuilding from the
    original statement (rather than from reflection) keeps partial-index
    predicates such as ``WHERE completed_time IS NOT NULL`` intact.
    """
    tables = _tables(conn)
    if conn.dialect.name == "postgresql":
        inspector = sa.inspect(conn)
        for table in INDEXED_TABLES:
            if table not in tables:
                continue
            for index in inspector.get_indexes(table):
                name = index.get("name")
                if not name or old not in name:
                    continue
                op.execute(
                    f"ALTER INDEX {_quote(name)} "
                    f"RENAME TO {_quote(name.replace(old, new))}"
                )
        return

    for table in INDEXED_TABLES:
        if table not in tables:
            continue
        rows = conn.execute(
            sa.text(
                "SELECT name, sql FROM sqlite_master "
                "WHERE type = 'index' AND tbl_name = :table AND sql IS NOT NULL"
            ).bindparams(table=table)
        ).fetchall()
        for name, ddl in rows:
            if old not in name:
                continue
            new_name = name.replace(old, new)
            pattern = (
                r"(CREATE\s+(?:UNIQUE\s+)?INDEX\s+)(\"?)" + re.escape(name) + r"\2"
            )
            new_ddl, count = re.subn(
                pattern,
                lambda match: match.group(1)
                + match.group(2)
                + new_name
                + match.group(2),
                ddl,
                count=1,
                flags=re.IGNORECASE,
            )
            if count != 1:
                raise RuntimeError(
                    f"Could not rewrite index name in DDL for {name!r}: {ddl!r}"
                )
            op.execute(f"DROP INDEX {_quote(name)}")
            op.execute(new_ddl)


def _rename_constraints(conn: sa.engine.Connection, old: str, new: str) -> None:
    """Rename constraints that still embed the old entity name (PostgreSQL only).

    SQLite keeps constraint names inside the table DDL and offers no way to
    rename them short of rebuilding the table; they are cosmetic there, so we
    leave them.
    """
    if conn.dialect.name != "postgresql":
        return
    inspector = sa.inspect(conn)
    tables = _tables(conn)
    for table in INDEXED_TABLES:
        if table not in tables:
            continue
        names: list[str] = []
        pk = inspector.get_pk_constraint(table)
        if pk and pk.get("name"):
            names.append(pk["name"])
        names.extend(
            fk["name"] for fk in inspector.get_foreign_keys(table) if fk.get("name")
        )
        names.extend(
            uq["name"]
            for uq in inspector.get_unique_constraints(table)
            if uq.get("name")
        )
        for name in names:
            if old not in name:
                continue
            op.execute(
                f"ALTER TABLE {_quote(table)} "
                f"RENAME CONSTRAINT {_quote(name)} TO {_quote(name.replace(old, new))}"
            )


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


def _update_scalar_values(
    conn: sa.engine.Connection, updates: list[tuple[str, str, str, str]]
) -> None:
    tables = _tables(conn)
    for table, column, old, new in updates:
        if table not in tables or column not in _columns(conn, table):
            continue
        op.execute(
            sa.text(
                f"UPDATE {_quote(table)} SET {_quote(column)} = :new "
                f"WHERE {_quote(column)} = :old"
            ).bindparams(old=old, new=new)
        )


def _rewrite_json_columns(
    conn: sa.engine.Connection, tokens: list[tuple[str, str]]
) -> None:
    """Rewrite embedded identifiers inside JSON columns.

    Done as a text substitution on the serialized JSON: the tokens are plain
    ASCII and only ever appear inside JSON string values or keys, so this
    cannot change the document structure.
    """
    tables = _tables(conn)
    is_postgres = conn.dialect.name == "postgresql"
    for table, column in JSON_COLUMNS:
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

    _rename_tables(conn, TABLE_RENAMES)
    _rename_columns(conn, COLUMN_RENAMES)
    _rename_indexes(conn, "big_plan", "project")
    _rename_constraints(conn, "big_plan", "project")

    _replace_in_columns(conn, PASCAL_COLUMNS, "BigPlan", "Project")
    _replace_in_columns(conn, SNAKE_COLUMNS, "big_plan", "project")
    _update_scalar_values(conn, SCALAR_VALUE_UPDATES)
    _rewrite_json_columns(conn, JSON_TOKENS)


def downgrade() -> None:
    conn = op.get_bind()

    _rewrite_json_columns(conn, [(new, old) for old, new in reversed(JSON_TOKENS)])
    _update_scalar_values(
        conn, [(t, c, new, old) for t, c, old, new in SCALAR_VALUE_UPDATES]
    )
    _replace_in_columns(conn, SNAKE_COLUMNS, "project", "big_plan")
    _replace_in_columns(conn, PASCAL_COLUMNS, "Project", "BigPlan")

    _rename_constraints(conn, "project", "big_plan")
    _rename_indexes(conn, "project", "big_plan")
    _rename_columns(conn, [(t, new, old) for t, old, new in COLUMN_RENAMES])
    _rename_tables(conn, [(new, old) for old, new in reversed(TABLE_RENAMES)])
