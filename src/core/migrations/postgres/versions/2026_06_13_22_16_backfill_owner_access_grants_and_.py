"""'backfill owner access grants and statuses'

Revision ID: 254e4cf74fe5
Revises: 538c815a20b5
Create Date: 2026-06-13 22:16:40.471928

"""

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
    ("ScheduleExternalSyncLog", "schedule_external_sync_log"),
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
    ("EmailVerificationAttempt", "email_verification_attempt"),
    ("GCLogEntry", "gc_log_entry"),
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
    ("ScheduleExternalSyncLogEntry", "schedule_external_sync_log_entry"),
    ("ScheduleStream", "schedule_stream"),
    ("ScoreLogEntry", "gamification_score_log_entry"),
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
    "email_verification_attempt": ("user_ref_id", "user"),
    "gamification_score_log": ("user_ref_id", "user"),
    "gamification_score_log_entry": ("score_log_ref_id", "gamification_score_log"),
    "gc_log": ("workspace_ref_id", "workspace"),
    "gc_log_entry": ("gc_log_ref_id", "gc_log"),
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
    "schedule_external_sync_log": ("schedule_domain_ref_id", "schedule_domain"),
    "schedule_external_sync_log_entry": (
        "schedule_external_sync_log_ref_id",
        "schedule_external_sync_log",
    ),
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


def _resolve_owner_user_ref_id(conn, ws_to_user, table, ref_id):
    """Walk the parent chain from a crown row up to its owning user ref id."""
    current_table = table
    current_ref_id = ref_id
    while True:
        chain = PARENT_CHAIN.get(current_table)
        if chain is None:
            return None
        parent_col, parent_table = chain
        parent_ref_id = conn.execute(
            text(
                # Identifiers come from trusted hardcoded constants, not user input.
                f'SELECT "{parent_col}" FROM "{current_table}" WHERE ref_id = :ref_id'  # nosec B608
            ),
            {"ref_id": current_ref_id},
        ).scalar()
        if parent_ref_id is None:
            return None
        if parent_table == "workspace":
            return ws_to_user.get(parent_ref_id)
        if parent_table == "user":
            return parent_ref_id
        current_table = parent_table
        current_ref_id = parent_ref_id


def upgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    ws_to_user = {
        row["workspace_ref_id"]: row["user_ref_id"]
        for row in conn.execute(
            text("SELECT workspace_ref_id, user_ref_id FROM user_workspace_link")
        ).mappings()
    }

    next_grant_ref_id = (
        conn.execute(text("SELECT MAX(ref_id) FROM access_grant")).scalar() or 0
    ) + 1
    next_status_ref_id = (
        conn.execute(text("SELECT MAX(ref_id) FROM access_status")).scalar() or 0
    ) + 1

    grant_insert = text(
        """
        INSERT INTO access_grant (
            ref_id, version, archived, archival_reason,
            created_time, last_modified_time, archived_time,
            access_domain_ref_id, name, entity, access_level, principal, user_ref_id
        ) VALUES (
            :ref_id, 1, :archived, NULL,
            :created_time, :last_modified_time, NULL,
            :access_domain_ref_id, :name, :entity, 'owner', 'user', :user_ref_id
        )
        """
    )
    status_insert = text(
        """
        INSERT INTO access_status (
            ref_id, version, archived, archival_reason,
            created_time, last_modified_time, archived_time,
            access_domain_ref_id, name, entity, access_level, user_ref_id, reason
        ) VALUES (
            :ref_id, 1, :archived, NULL,
            :created_time, :last_modified_time, NULL,
            :access_domain_ref_id, :name, :entity, 'owner', :user_ref_id, 'grant'
        )
        """
    )

    for class_name, table in CROWN_ENTITIES:
        if not inspector.has_table(table):
            continue
        rows = (
            conn.execute(
                text(
                    # Table name comes from CROWN_ENTITIES constants, not user input.
                    f'SELECT ref_id, created_time, last_modified_time FROM "{table}"'  # nosec B608
                )
            )
            .mappings()
            .all()
        )
        for row in rows:
            owner_user_ref_id = _resolve_owner_user_ref_id(
                conn, ws_to_user, table, row["ref_id"]
            )
            if owner_user_ref_id is None:
                continue
            entity_link = f"{class_name}:std:{row['ref_id']}"
            common = {
                "created_time": row["created_time"],
                "last_modified_time": row["last_modified_time"],
                "access_domain_ref_id": ACCESS_DOMAIN_REF_ID,
                "name": NOT_USED_NAME,
                "entity": entity_link,
                "archived": False,
                "user_ref_id": owner_user_ref_id,
            }
            conn.execute(grant_insert, {**common, "ref_id": next_grant_ref_id})
            next_grant_ref_id += 1
            conn.execute(status_insert, {**common, "ref_id": next_status_ref_id})
            next_status_ref_id += 1


def downgrade():
    op.execute("DELETE FROM access_status")
    op.execute("DELETE FROM access_grant")
