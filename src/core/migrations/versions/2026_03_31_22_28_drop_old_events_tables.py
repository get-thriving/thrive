"""'Drop old events tables'

Revision ID: 010b99ed22ec
Revises: 4041fd2425d2
Create Date: 2026-03-31 22:28:11.362378

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "010b99ed22ec"
down_revision = "4041fd2425d2"
branch_labels = None
depends_on = None


def upgrade():
    op.drop_table("metric_event")
    op.drop_table("metric_entry_event")
    op.drop_table("person_event")
    op.drop_table("workspace_event")
    op.drop_table("aspect_event")
    op.drop_table("vacation_event")
    op.drop_table("smart_list_event")
    op.drop_table("smart_list_item_event")
    op.drop_table("big_plan_collection_event")
    op.drop_table("big_plan_event")
    op.drop_table("inbox_task_collection_event")
    op.drop_table("inbox_task_event")
    op.drop_table("life_plan_event")
    op.drop_table("vacation_collection_event")
    op.drop_table("metric_collection_event")
    op.drop_table("smart_list_collection_event")
    op.drop_table("prm_event")
    op.drop_table("habit_collection_event")
    op.drop_table("habit_event")
    op.drop_table("chore_collection_event")
    op.drop_table("chore_event")
    op.drop_table("push_integration_group_event")
    op.drop_table("slack_task_collection_event")
    op.drop_table("slack_task_event")
    op.drop_table("email_task_collection_event")
    op.drop_table("email_task_event")
    op.drop_table("user_event")
    op.drop_table("auth_event")
    op.drop_table("user_workspace_link_event")
    op.drop_table("gamification_score_log_event")
    op.drop_table("gamification_score_log_entry_event")
    op.drop_table("note_collection_event")
    op.drop_table("note_event")
    op.drop_table("gc_log_event")
    op.drop_table("gc_log_entry_event")
    op.drop_table("gen_log_event")
    op.drop_table("gen_log_entry_event")
    op.drop_table("doc_collection_event")
    op.drop_table("doc_event")
    op.drop_table("journal_collection_event")
    op.drop_table("journal_event")
    op.drop_table("working_mem_collection_event")
    op.drop_table("working_mem_event")
    op.drop_table("time_plan_domain_event")
    op.drop_table("time_plan_event")
    op.drop_table("time_plan_activity_event")
    op.drop_table("time_event_domain_event")
    op.drop_table("time_event_in_day_block_event")
    op.drop_table("time_event_full_days_block_event")
    op.drop_table("schedule_domain_event")
    op.drop_table("schedule_stream_event")
    op.drop_table("schedule_event_in_day_event")
    op.drop_table("schedule_event_full_days_event")
    op.drop_table("schedule_external_sync_log_event")
    op.drop_table("schedule_external_sync_log_entry_event")
    op.drop_table("stats_log_event")
    op.drop_table("stats_log_entry_event")
    op.drop_table("home_config_event")
    op.drop_table("home_tab_event")
    op.drop_table("home_widget_event")
    op.drop_table("big_plan_milestone_event")
    op.drop_table("chapter_event")
    op.drop_table("milestone_event")
    op.drop_table("goal_event")
    op.drop_table("vision_event")
    op.drop_table("circle_event")
    op.drop_table("occasion_event")
    op.drop_table("tag_domain_event")
    op.drop_table("tag_event")
    op.drop_table("tag_link_event")
    op.drop_table("api_key_event")
    op.drop_table("contact_domain_event")
    op.drop_table("contact_event")
    op.drop_table("contact_link_event")
    op.drop_table("web_ui_settings_event")
    op.drop_table("mcp_key_event")
    op.drop_table("schedule_export_event")
    op.drop_table("todo_domain_event")
    op.drop_table("todo_task_event")


def downgrade():
    pass
