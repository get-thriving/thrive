"""'backfill owner access grants and statuses'

Revision ID: 254e4cf74fe5
Revises: 538c815a20b5
Create Date: 2026-06-13 22:16:40.471928

"""

import time

import sqlalchemy as sa
from alembic import op
from sqlalchemy import text

# revision identifiers, used by Alembic.
revision = "254e4cf74fe5"
down_revision = "538c815a20b5"
branch_labels = None
depends_on = None


# The singleton access domain (see the access_domain migration).
ACCESS_DOMAIN_REF_ID = 1
# Sentinel name for nameless leaf-support entities (jupiter.framework NOT_USED_NAME).
NOT_USED_NAME = "NOT-USED"


# All concrete crown entities (BranchEntity / LeafEntity, excluding LeafSupportEntity),
# as (entity-link type name, table name). Frozen snapshot of the model at this revision.
CROWN_ENTITIES = (
    ("HomeTab", "home_tab"),
    ("Metric", "metric"),
    ("SmartList", "smart_list"),
    ("APIKey", "api_key"),
    ("Aspect", "aspect"),
    ("BigPlan", "big_plan"),
    ("Chapter", "chapter"),
    ("Chore", "chore"),
    ("Circle", "circle"),
    ("Dir", "dir"),
    ("Doc", "doc"),
    ("EmailTask", "email_task"),
    ("Goal", "goal"),
    ("Habit", "habit"),
    ("HomeWidget", "home_widget"),
    ("Journal", "journal"),
    ("MCPKey", "mcp_key"),
    ("MetricEntry", "metric_entry"),
    ("Milestone", "milestone"),
    ("Occasion", "occasion"),
    ("Person", "person"),
    ("PublishEntity", "publish_entity"),
    ("ScheduleEventFullDays", "schedule_event_full_days"),
    ("ScheduleEventInDay", "schedule_event_in_day"),
    ("ScheduleExport", "schedule_export"),
    ("ScheduleStream", "schedule_stream"),
    ("SlackTask", "slack_task"),
    ("SmartListItem", "smart_list_item"),
    ("TimePlan", "time_plan"),
    ("TimePlanActivity", "time_plan_activity"),
    ("TodoTask", "todo_task"),
    ("Vacation", "vacation"),
    ("Vision", "vision"),
)


# table -> (parent_ref_id_column, parent_table). The walk terminates when the parent
# table is "workspace" (owner via user_workspace_link) or "user" (owner is that ref id).
PARENT_CHAIN = {
    "api_key": ("user_ref_id", "user"),
    "aspect": ("life_plan_ref_id", "life_plan"),
    "big_plan": ("big_plan_collection_ref_id", "big_plan_collection"),
    "big_plan_collection": ("workspace_ref_id", "workspace"),
    "chapter": ("life_plan_ref_id", "life_plan"),
    "chore": ("chore_collection_ref_id", "chore_collection"),
    "chore_collection": ("workspace_ref_id", "workspace"),
    "circle": ("prm_ref_id", "prm"),
    "dir": ("doc_collection_ref_id", "doc_collection"),
    "doc": ("doc_collection_ref_id", "doc_collection"),
    "doc_collection": ("workspace_ref_id", "workspace"),
    "email_task": ("email_task_collection_ref_id", "email_task_collection"),
    "email_task_collection": (
        "push_integration_group_ref_id",
        "push_integration_group",
    ),
    "gamification_score_log": ("user_ref_id", "user"),
    "goal": ("life_plan_ref_id", "life_plan"),
    "habit": ("habit_collection_ref_id", "habit_collection"),
    "habit_collection": ("workspace_ref_id", "workspace"),
    "home_config": ("workspace_ref_id", "workspace"),
    "home_tab": ("home_config_ref_id", "home_config"),
    "home_widget": ("home_tab_ref_id", "home_tab"),
    "journal": ("journal_collection_ref_id", "journal_collection"),
    "journal_collection": ("workspace_ref_id", "workspace"),
    "life_plan": ("workspace_ref_id", "workspace"),
    "mcp_key": ("user_ref_id", "user"),
    "metric": ("metric_collection_ref_id", "metric_collection"),
    "metric_collection": ("workspace_ref_id", "workspace"),
    "metric_entry": ("metric_ref_id", "metric"),
    "milestone": ("life_plan_ref_id", "life_plan"),
    "occasion": ("person_ref_id", "person"),
    "person": ("prm_ref_id", "prm"),
    "prm": ("workspace_ref_id", "workspace"),
    "publish_domain": ("workspace_ref_id", "workspace"),
    "publish_entity": ("publish_domain_ref_id", "publish_domain"),
    "push_integration_group": ("workspace_ref_id", "workspace"),
    "schedule_domain": ("workspace_ref_id", "workspace"),
    "schedule_event_full_days": ("schedule_domain_ref_id", "schedule_domain"),
    "schedule_event_in_day": ("schedule_domain_ref_id", "schedule_domain"),
    "schedule_export": ("schedule_domain_ref_id", "schedule_domain"),
    "schedule_stream": ("schedule_domain_ref_id", "schedule_domain"),
    "slack_task": ("slack_task_collection_ref_id", "slack_task_collection"),
    "slack_task_collection": (
        "push_integration_group_ref_id",
        "push_integration_group",
    ),
    "smart_list": ("smart_list_collection_ref_id", "smart_list_collection"),
    "smart_list_collection": ("workspace_ref_id", "workspace"),
    "smart_list_item": ("smart_list_ref_id", "smart_list"),
    "time_plan": ("time_plan_domain_ref_id", "time_plan_domain"),
    "time_plan_activity": ("time_plan_ref_id", "time_plan"),
    "time_plan_domain": ("workspace_ref_id", "workspace"),
    "todo_domain": ("workspace_ref_id", "workspace"),
    "todo_task": ("todo_domain_ref_id", "todo_domain"),
    "vacation": ("vacation_collection_ref_id", "vacation_collection"),
    "vacation_collection": ("workspace_ref_id", "workspace"),
    "vision": ("life_plan_ref_id", "life_plan"),
}


def _format_duration(seconds: float) -> str:
    """Human-readable duration for migration progress logs."""
    if seconds < 60:
        return f"{seconds:.1f}s"
    minutes, secs = divmod(int(seconds), 60)
    if minutes < 60:
        return f"{minutes}m {secs}s"
    hours, minutes = divmod(minutes, 60)
    return f"{hours}h {minutes}m {secs}s"


def _log_progress(message: str) -> None:
    print(f"[backfill access grants] {message}", flush=True)


def _build_owner_resolution_sql(
    table: str,
) -> tuple[list[str], str, str] | None:
    """Turn PARENT_CHAIN into JOIN clauses ending at the owning user ref id."""
    joins: list[str] = []
    current_table = table
    current_alias = "t0"
    alias_index = 0

    while True:
        chain = PARENT_CHAIN.get(current_table)
        if chain is None:
            return None
        parent_col, parent_table = chain

        if parent_table == "workspace":
            joins.append(
                "JOIN user_workspace_link uwl "
                f'ON {current_alias}."{parent_col}" = uwl.workspace_ref_id'
            )
            user_ref_id = "uwl.user_ref_id"
            return joins, user_ref_id, f"{user_ref_id} IS NOT NULL"

        if parent_table == "user":
            user_ref_id = f'{current_alias}."{parent_col}"'
            return joins, user_ref_id, f"{user_ref_id} IS NOT NULL"

        alias_index += 1
        next_alias = f"t{alias_index}"
        joins.append(
            f'JOIN "{parent_table}" {next_alias} '
            f'ON {current_alias}."{parent_col}" = {next_alias}.ref_id'
        )
        current_table = parent_table
        current_alias = next_alias


def _bulk_insert_grants_sql(
    class_name: str, table: str, *, postgres: bool
) -> str | None:
    """INSERT … SELECT for access_grant rows for one crown table."""
    resolution = _build_owner_resolution_sql(table)
    if resolution is None:
        return None
    joins, user_ref_id, where_clause = resolution
    join_sql = "\n        ".join(joins)
    entity_expr = f"'{class_name}:std:' || t0.ref_id"

    if postgres:
        return f"""
        INSERT INTO access_grant (
            version, archived, archival_reason,
            created_time, last_modified_time, archived_time,
            access_domain_ref_id, name, entity, access_level, principal, user_ref_id
        )
        SELECT
            1,
            false,
            NULL,
            t0.created_time,
            t0.last_modified_time,
            NULL,
            {ACCESS_DOMAIN_REF_ID},
            '{NOT_USED_NAME}',
            {entity_expr},
            'owner',
            'user',
            {user_ref_id}
        FROM "{table}" t0
        {join_sql}
        WHERE {where_clause}
        """  # nosec B608

    return f"""
        INSERT INTO access_grant (
            ref_id, version, archived, archival_reason,
            created_time, last_modified_time, archived_time,
            access_domain_ref_id, name, entity, access_level, principal, user_ref_id
        )
        SELECT
            (SELECT COALESCE(MAX(ref_id), 0) FROM access_grant)
                + ROW_NUMBER() OVER (ORDER BY t0.ref_id),
            1,
            0,
            NULL,
            t0.created_time,
            t0.last_modified_time,
            NULL,
            {ACCESS_DOMAIN_REF_ID},
            '{NOT_USED_NAME}',
            {entity_expr},
            'owner',
            'user',
            {user_ref_id}
        FROM "{table}" t0
        {join_sql}
        WHERE {where_clause}
        """  # nosec B608


def _bulk_insert_status_sql(class_name: str) -> str:
    """INSERT … SELECT for access_status rows from grants for one entity type."""
    entity_prefix = f"{class_name}:std:"
    return f"""
        INSERT INTO access_status (
            access_domain_ref_id,
            entity,
            user_ref_id,
            access_level,
            reason,
            access_grant_ref_id,
            created_time,
            last_modified_time
        )
        SELECT
            g.access_domain_ref_id,
            g.entity,
            g.user_ref_id,
            'owner',
            'grant',
            g.ref_id,
            g.created_time,
            g.last_modified_time
        FROM access_grant g
        WHERE g.entity LIKE '{entity_prefix}%'
          AND NOT EXISTS (
              SELECT 1
              FROM access_status s
              WHERE s.access_domain_ref_id = g.access_domain_ref_id
                AND s.entity = g.entity
                AND s.user_ref_id = g.user_ref_id
          )
        """


def upgrade():
    migration_start = time.monotonic()
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    postgres = conn.dialect.name == "postgresql"

    tables_to_process: list[tuple[str, str, int]] = []
    total_rows = 0
    _log_progress("Counting crown rows per table…")
    for class_name, table in CROWN_ENTITIES:
        if not inspector.has_table(table):
            _log_progress(f"  {table} ({class_name}): table missing, skipping")
            continue
        row_count = (
            conn.execute(
                text(
                    # Table name comes from CROWN_ENTITIES constants, not user input.
                    f'SELECT COUNT(*) FROM "{table}"'  # nosec B608
                )
            ).scalar()
            or 0
        )
        _log_progress(f"  {table} ({class_name}): {row_count} rows")
        tables_to_process.append((class_name, table, row_count))
        total_rows += row_count

    _log_progress(
        f"Row counts complete: {len(tables_to_process)} tables, "
        f"{total_rows} crown rows total — starting bulk backfill…"
    )

    grants_created = 0
    rows_skipped = 0

    for table_index, (class_name, table, row_count) in enumerate(
        tables_to_process, start=1
    ):
        table_start = time.monotonic()
        _log_progress(
            f"Table {table_index}/{len(tables_to_process)} {table} ({class_name}): "
            f"{row_count} source rows — inserting grants…"
        )

        grant_sql = _bulk_insert_grants_sql(class_name, table, postgres=postgres)
        if grant_sql is None:
            _log_progress(f"  {table}: no PARENT_CHAIN entry, skipping")
            rows_skipped += row_count
            continue

        grant_result = conn.execute(text(grant_sql))
        table_grants = grant_result.rowcount
        grants_created += table_grants
        table_skipped = row_count - table_grants
        rows_skipped += table_skipped

        status_result = conn.execute(text(_bulk_insert_status_sql(class_name)))
        table_statuses = status_result.rowcount

        table_elapsed = time.monotonic() - table_start
        _log_progress(
            f"Finished {table}: {table_grants} grants, {table_statuses} statuses, "
            f"{table_skipped} source rows skipped, "
            f"took {_format_duration(table_elapsed)}"
        )

    total_elapsed = time.monotonic() - migration_start
    _log_progress(
        f"Backfill complete: {grants_created} grants created, "
        f"{rows_skipped} source rows skipped, "
        f"total time {_format_duration(total_elapsed)}"
    )

    if postgres:
        _log_progress("Syncing access_grant ref_id sequence…")
        conn.execute(
            text(
                """
                SELECT setval(
                    pg_get_serial_sequence('access_grant', 'ref_id'),
                    COALESCE((SELECT MAX(ref_id) FROM access_grant), 1),
                    true
                )
                """
            )
        )
        _log_progress("Sequence sync complete.")


def downgrade():
    op.execute("DELETE FROM access_status")
    op.execute("DELETE FROM access_grant")
