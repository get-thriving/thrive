"""The Jupiter MCP server."""

import asyncio

from jupiter.core.config import build_global_properties
from jupiter.framework.telemetry.local.local import LocalTelemetry
from jupiter.framework.telemetry.sentry.sentry import SentryTelemetry
from jupiter.framework.telemetry.telemetry import Telemetry
from jupiter.mcp.config import (
    JupiterMcpPorts,
    JupiterMcpResource,
    JupiterMcpService,
    JupiterMcpTool,
    build_mcp_properties,
)
from jupiter.mcp.webapi_client import WebApiClient

# --- Big Plans API ---
from jupiter_webapi_client.api.big_plans.big_plan_archive import (
    asyncio_detailed as big_plan_archive,
)
from jupiter_webapi_client.api.big_plans.big_plan_create import (
    asyncio_detailed as big_plan_create,
)
from jupiter_webapi_client.api.big_plans.big_plan_create_inbox_task import (
    asyncio_detailed as big_plan_create_inbox_task,
)
from jupiter_webapi_client.api.big_plans.big_plan_find import (
    asyncio_detailed as big_plan_find,
)
from jupiter_webapi_client.api.big_plans.big_plan_load import (
    asyncio_detailed as big_plan_load,
)
from jupiter_webapi_client.api.big_plans.big_plan_milestone_archive import (
    asyncio_detailed as big_plan_milestone_archive,
)
from jupiter_webapi_client.api.big_plans.big_plan_milestone_create import (
    asyncio_detailed as big_plan_milestone_create,
)
from jupiter_webapi_client.api.big_plans.big_plan_milestone_load import (
    asyncio_detailed as big_plan_milestone_load,
)
from jupiter_webapi_client.api.big_plans.big_plan_milestone_remove import (
    asyncio_detailed as big_plan_milestone_remove,
)
from jupiter_webapi_client.api.big_plans.big_plan_milestone_update import (
    asyncio_detailed as big_plan_milestone_update,
)
from jupiter_webapi_client.api.big_plans.big_plan_remove import (
    asyncio_detailed as big_plan_remove,
)
from jupiter_webapi_client.api.big_plans.big_plan_update import (
    asyncio_detailed as big_plan_update,
)

# --- Chores API ---
from jupiter_webapi_client.api.chores.chore_archive import (
    asyncio_detailed as chore_archive,
)
from jupiter_webapi_client.api.chores.chore_create import (
    asyncio_detailed as chore_create,
)
from jupiter_webapi_client.api.chores.chore_find import (
    asyncio_detailed as chore_find,
)
from jupiter_webapi_client.api.chores.chore_load import (
    asyncio_detailed as chore_load,
)
from jupiter_webapi_client.api.chores.chore_remove import (
    asyncio_detailed as chore_remove,
)
from jupiter_webapi_client.api.chores.chore_suspend import (
    asyncio_detailed as chore_suspend,
)
from jupiter_webapi_client.api.chores.chore_unsuspend import (
    asyncio_detailed as chore_unsuspend,
)
from jupiter_webapi_client.api.chores.chore_update import (
    asyncio_detailed as chore_update,
)

# --- Contacts API ---
from jupiter_webapi_client.api.contacts.contact_archive import (
    asyncio_detailed as contact_archive,
)
from jupiter_webapi_client.api.contacts.contact_create import (
    asyncio_detailed as contact_create,
)
from jupiter_webapi_client.api.contacts.contact_find import (
    asyncio_detailed as contact_find,
)
from jupiter_webapi_client.api.contacts.contact_link_upsert import (
    asyncio_detailed as contact_link_upsert,
)
from jupiter_webapi_client.api.contacts.contact_load import (
    asyncio_detailed as contact_load,
)
from jupiter_webapi_client.api.contacts.contact_remove import (
    asyncio_detailed as contact_remove,
)
from jupiter_webapi_client.api.contacts.contact_update import (
    asyncio_detailed as contact_update,
)

# --- Docs API ---
from jupiter_webapi_client.api.docs.doc_archive import (
    asyncio_detailed as doc_archive,
)
from jupiter_webapi_client.api.docs.doc_create import (
    asyncio_detailed as doc_create,
)
from jupiter_webapi_client.api.docs.doc_find import (
    asyncio_detailed as doc_find,
)
from jupiter_webapi_client.api.docs.doc_load import (
    asyncio_detailed as doc_load,
)
from jupiter_webapi_client.api.docs.doc_remove import (
    asyncio_detailed as doc_remove,
)
from jupiter_webapi_client.api.docs.doc_update import (
    asyncio_detailed as doc_update,
)

# --- Habits API ---
from jupiter_webapi_client.api.habits.habit_archive import (
    asyncio_detailed as habit_archive,
)
from jupiter_webapi_client.api.habits.habit_create import (
    asyncio_detailed as habit_create,
)
from jupiter_webapi_client.api.habits.habit_find import (
    asyncio_detailed as habit_find,
)
from jupiter_webapi_client.api.habits.habit_load import (
    asyncio_detailed as habit_load,
)
from jupiter_webapi_client.api.habits.habit_remove import (
    asyncio_detailed as habit_remove,
)
from jupiter_webapi_client.api.habits.habit_suspend import (
    asyncio_detailed as habit_suspend,
)
from jupiter_webapi_client.api.habits.habit_unsuspend import (
    asyncio_detailed as habit_unsuspend,
)
from jupiter_webapi_client.api.habits.habit_update import (
    asyncio_detailed as habit_update,
)

# --- Inbox Tasks API ---
from jupiter_webapi_client.api.inbox_tasks.inbox_task_archive import (
    asyncio_detailed as inbox_task_archive,
)
from jupiter_webapi_client.api.inbox_tasks.inbox_task_find import (
    asyncio_detailed as inbox_task_find,
)
from jupiter_webapi_client.api.inbox_tasks.inbox_task_load import (
    asyncio_detailed as inbox_task_load,
)
from jupiter_webapi_client.api.inbox_tasks.inbox_task_remove import (
    asyncio_detailed as inbox_task_remove,
)
from jupiter_webapi_client.api.inbox_tasks.inbox_task_update import (
    asyncio_detailed as inbox_task_update,
)

# --- Journals API ---
from jupiter_webapi_client.api.journals.journal_archive import (
    asyncio_detailed as journal_archive,
)
from jupiter_webapi_client.api.journals.journal_change_time_config import (
    asyncio_detailed as journal_change_time_config,
)
from jupiter_webapi_client.api.journals.journal_create import (
    asyncio_detailed as journal_create,
)
from jupiter_webapi_client.api.journals.journal_find import (
    asyncio_detailed as journal_find,
)
from jupiter_webapi_client.api.journals.journal_load import (
    asyncio_detailed as journal_load,
)
from jupiter_webapi_client.api.journals.journal_load_for_date_and_period import (
    asyncio_detailed as journal_load_for_date_and_period,
)
from jupiter_webapi_client.api.journals.journal_load_settings import (
    asyncio_detailed as journal_load_settings,
)
from jupiter_webapi_client.api.journals.journal_remove import (
    asyncio_detailed as journal_remove,
)
from jupiter_webapi_client.api.journals.journal_update_settings import (
    asyncio_detailed as journal_update_settings,
)
from jupiter_webapi_client.api.life_plan.aspect_archive import (
    asyncio_detailed as aspect_archive,
)
from jupiter_webapi_client.api.life_plan.aspect_create import (
    asyncio_detailed as aspect_create,
)
from jupiter_webapi_client.api.life_plan.aspect_find import (
    asyncio_detailed as aspect_find,
)
from jupiter_webapi_client.api.life_plan.aspect_load import (
    asyncio_detailed as aspect_load,
)
from jupiter_webapi_client.api.life_plan.aspect_remove import (
    asyncio_detailed as aspect_remove,
)
from jupiter_webapi_client.api.life_plan.aspect_reorder_children import (
    asyncio_detailed as aspect_reorder_children,
)
from jupiter_webapi_client.api.life_plan.aspect_update import (
    asyncio_detailed as aspect_update,
)
from jupiter_webapi_client.api.life_plan.chapter_archive import (
    asyncio_detailed as chapter_archive,
)
from jupiter_webapi_client.api.life_plan.chapter_create import (
    asyncio_detailed as chapter_create,
)
from jupiter_webapi_client.api.life_plan.chapter_find import (
    asyncio_detailed as chapter_find,
)
from jupiter_webapi_client.api.life_plan.chapter_load import (
    asyncio_detailed as chapter_load,
)
from jupiter_webapi_client.api.life_plan.chapter_remove import (
    asyncio_detailed as chapter_remove,
)
from jupiter_webapi_client.api.life_plan.chapter_update import (
    asyncio_detailed as chapter_update,
)
from jupiter_webapi_client.api.life_plan.goal_archive import (
    asyncio_detailed as goal_archive,
)
from jupiter_webapi_client.api.life_plan.goal_create import (
    asyncio_detailed as goal_create,
)
from jupiter_webapi_client.api.life_plan.goal_find import (
    asyncio_detailed as goal_find,
)
from jupiter_webapi_client.api.life_plan.goal_load import (
    asyncio_detailed as goal_load,
)
from jupiter_webapi_client.api.life_plan.goal_remove import (
    asyncio_detailed as goal_remove,
)
from jupiter_webapi_client.api.life_plan.goal_update import (
    asyncio_detailed as goal_update,
)

# --- Life Plan API ---
from jupiter_webapi_client.api.life_plan.life_plan_update import (
    asyncio_detailed as life_plan_update,
)
from jupiter_webapi_client.api.life_plan.milestone_archive import (
    asyncio_detailed as milestone_archive,
)
from jupiter_webapi_client.api.life_plan.milestone_create import (
    asyncio_detailed as milestone_create,
)
from jupiter_webapi_client.api.life_plan.milestone_find import (
    asyncio_detailed as milestone_find,
)
from jupiter_webapi_client.api.life_plan.milestone_load import (
    asyncio_detailed as milestone_load,
)
from jupiter_webapi_client.api.life_plan.milestone_remove import (
    asyncio_detailed as milestone_remove,
)
from jupiter_webapi_client.api.life_plan.milestone_update import (
    asyncio_detailed as milestone_update,
)
from jupiter_webapi_client.api.life_plan.vision_archive import (
    asyncio_detailed as vision_archive,
)
from jupiter_webapi_client.api.life_plan.vision_create_draft import (
    asyncio_detailed as vision_create_draft,
)
from jupiter_webapi_client.api.life_plan.vision_find import (
    asyncio_detailed as vision_find,
)
from jupiter_webapi_client.api.life_plan.vision_load import (
    asyncio_detailed as vision_load,
)
from jupiter_webapi_client.api.life_plan.vision_load_active import (
    asyncio_detailed as vision_load_active,
)
from jupiter_webapi_client.api.life_plan.vision_mark_draft_as_active import (
    asyncio_detailed as vision_mark_draft_as_active,
)
from jupiter_webapi_client.api.life_plan.vision_remove import (
    asyncio_detailed as vision_remove,
)

# --- Metrics API ---
from jupiter_webapi_client.api.metrics.metric_archive import (
    asyncio_detailed as metric_archive,
)
from jupiter_webapi_client.api.metrics.metric_create import (
    asyncio_detailed as metric_create,
)
from jupiter_webapi_client.api.metrics.metric_entry_archive import (
    asyncio_detailed as metric_entry_archive,
)
from jupiter_webapi_client.api.metrics.metric_entry_create import (
    asyncio_detailed as metric_entry_create,
)
from jupiter_webapi_client.api.metrics.metric_entry_load import (
    asyncio_detailed as metric_entry_load,
)
from jupiter_webapi_client.api.metrics.metric_entry_remove import (
    asyncio_detailed as metric_entry_remove,
)
from jupiter_webapi_client.api.metrics.metric_entry_update import (
    asyncio_detailed as metric_entry_update,
)
from jupiter_webapi_client.api.metrics.metric_find import (
    asyncio_detailed as metric_find,
)
from jupiter_webapi_client.api.metrics.metric_load import (
    asyncio_detailed as metric_load,
)
from jupiter_webapi_client.api.metrics.metric_load_settings import (
    asyncio_detailed as metric_load_settings,
)
from jupiter_webapi_client.api.metrics.metric_remove import (
    asyncio_detailed as metric_remove,
)
from jupiter_webapi_client.api.metrics.metric_update import (
    asyncio_detailed as metric_update,
)

# --- Notes API ---
from jupiter_webapi_client.api.notes.note_archive import (
    asyncio_detailed as note_archive,
)
from jupiter_webapi_client.api.notes.note_create import (
    asyncio_detailed as note_create,
)
from jupiter_webapi_client.api.notes.note_find import (
    asyncio_detailed as note_find,
)
from jupiter_webapi_client.api.notes.note_load import (
    asyncio_detailed as note_load,
)
from jupiter_webapi_client.api.notes.note_remove import (
    asyncio_detailed as note_remove,
)
from jupiter_webapi_client.api.notes.note_update import (
    asyncio_detailed as note_update,
)

# --- PRM API ---
from jupiter_webapi_client.api.prm.circle_archive import (
    asyncio_detailed as circle_archive,
)
from jupiter_webapi_client.api.prm.circle_create import (
    asyncio_detailed as circle_create,
)
from jupiter_webapi_client.api.prm.circle_find import (
    asyncio_detailed as circle_find,
)
from jupiter_webapi_client.api.prm.circle_load import (
    asyncio_detailed as circle_load,
)
from jupiter_webapi_client.api.prm.circle_remove import (
    asyncio_detailed as circle_remove,
)
from jupiter_webapi_client.api.prm.circle_update import (
    asyncio_detailed as circle_update,
)
from jupiter_webapi_client.api.prm.occasion_archive import (
    asyncio_detailed as occasion_archive,
)
from jupiter_webapi_client.api.prm.occasion_create import (
    asyncio_detailed as occasion_create,
)
from jupiter_webapi_client.api.prm.occasion_load import (
    asyncio_detailed as occasion_load,
)
from jupiter_webapi_client.api.prm.occasion_remove import (
    asyncio_detailed as occasion_remove,
)
from jupiter_webapi_client.api.prm.occasion_update import (
    asyncio_detailed as occasion_update,
)
from jupiter_webapi_client.api.prm.person_archive import (
    asyncio_detailed as person_archive,
)
from jupiter_webapi_client.api.prm.person_create import (
    asyncio_detailed as person_create,
)
from jupiter_webapi_client.api.prm.person_find import (
    asyncio_detailed as person_find,
)
from jupiter_webapi_client.api.prm.person_load import (
    asyncio_detailed as person_load,
)
from jupiter_webapi_client.api.prm.person_load_settings import (
    asyncio_detailed as person_load_settings,
)
from jupiter_webapi_client.api.prm.person_remove import (
    asyncio_detailed as person_remove,
)
from jupiter_webapi_client.api.prm.person_update import (
    asyncio_detailed as person_update,
)
from jupiter_webapi_client.api.schedule.schedule_event_full_days_archive import (
    asyncio_detailed as schedule_event_full_days_archive,
)
from jupiter_webapi_client.api.schedule.schedule_event_full_days_change_schedule_stream import (
    asyncio_detailed as schedule_event_full_days_change_schedule_stream,
)
from jupiter_webapi_client.api.schedule.schedule_event_full_days_create import (
    asyncio_detailed as schedule_event_full_days_create,
)
from jupiter_webapi_client.api.schedule.schedule_event_full_days_load import (
    asyncio_detailed as schedule_event_full_days_load,
)
from jupiter_webapi_client.api.schedule.schedule_event_full_days_remove import (
    asyncio_detailed as schedule_event_full_days_remove,
)
from jupiter_webapi_client.api.schedule.schedule_event_full_days_update import (
    asyncio_detailed as schedule_event_full_days_update,
)
from jupiter_webapi_client.api.schedule.schedule_event_in_day_archive import (
    asyncio_detailed as schedule_event_in_day_archive,
)
from jupiter_webapi_client.api.schedule.schedule_event_in_day_change_schedule_stream import (
    asyncio_detailed as schedule_event_in_day_change_schedule_stream,
)
from jupiter_webapi_client.api.schedule.schedule_event_in_day_create import (
    asyncio_detailed as schedule_event_in_day_create,
)
from jupiter_webapi_client.api.schedule.schedule_event_in_day_load import (
    asyncio_detailed as schedule_event_in_day_load,
)
from jupiter_webapi_client.api.schedule.schedule_event_in_day_remove import (
    asyncio_detailed as schedule_event_in_day_remove,
)
from jupiter_webapi_client.api.schedule.schedule_event_in_day_update import (
    asyncio_detailed as schedule_event_in_day_update,
)
from jupiter_webapi_client.api.schedule.schedule_export_archive import (
    asyncio_detailed as schedule_export_archive,
)
from jupiter_webapi_client.api.schedule.schedule_export_create import (
    asyncio_detailed as schedule_export_create,
)
from jupiter_webapi_client.api.schedule.schedule_export_find import (
    asyncio_detailed as schedule_export_find,
)
from jupiter_webapi_client.api.schedule.schedule_export_load import (
    asyncio_detailed as schedule_export_load,
)
from jupiter_webapi_client.api.schedule.schedule_export_remove import (
    asyncio_detailed as schedule_export_remove,
)
from jupiter_webapi_client.api.schedule.schedule_export_update import (
    asyncio_detailed as schedule_export_update,
)

# --- Schedule API ---
from jupiter_webapi_client.api.schedule.schedule_stream_archive import (
    asyncio_detailed as schedule_stream_archive,
)
from jupiter_webapi_client.api.schedule.schedule_stream_create_for_external_ical import (
    asyncio_detailed as schedule_stream_create_for_external_ical,
)
from jupiter_webapi_client.api.schedule.schedule_stream_create_for_user import (
    asyncio_detailed as schedule_stream_create_for_user,
)
from jupiter_webapi_client.api.schedule.schedule_stream_find import (
    asyncio_detailed as schedule_stream_find,
)
from jupiter_webapi_client.api.schedule.schedule_stream_load import (
    asyncio_detailed as schedule_stream_load,
)
from jupiter_webapi_client.api.schedule.schedule_stream_remove import (
    asyncio_detailed as schedule_stream_remove,
)
from jupiter_webapi_client.api.schedule.schedule_stream_update import (
    asyncio_detailed as schedule_stream_update,
)

# --- Smart Lists API ---
from jupiter_webapi_client.api.smart_lists.smart_list_archive import (
    asyncio_detailed as smart_list_archive,
)
from jupiter_webapi_client.api.smart_lists.smart_list_create import (
    asyncio_detailed as smart_list_create,
)
from jupiter_webapi_client.api.smart_lists.smart_list_find import (
    asyncio_detailed as smart_list_find,
)
from jupiter_webapi_client.api.smart_lists.smart_list_item_archive import (
    asyncio_detailed as smart_list_item_archive,
)
from jupiter_webapi_client.api.smart_lists.smart_list_item_create import (
    asyncio_detailed as smart_list_item_create,
)
from jupiter_webapi_client.api.smart_lists.smart_list_item_load import (
    asyncio_detailed as smart_list_item_load,
)
from jupiter_webapi_client.api.smart_lists.smart_list_item_remove import (
    asyncio_detailed as smart_list_item_remove,
)
from jupiter_webapi_client.api.smart_lists.smart_list_item_update import (
    asyncio_detailed as smart_list_item_update,
)
from jupiter_webapi_client.api.smart_lists.smart_list_load import (
    asyncio_detailed as smart_list_load,
)
from jupiter_webapi_client.api.smart_lists.smart_list_remove import (
    asyncio_detailed as smart_list_remove,
)
from jupiter_webapi_client.api.smart_lists.smart_list_update import (
    asyncio_detailed as smart_list_update,
)

# --- Tags API ---
from jupiter_webapi_client.api.tags.tag_archive import (
    asyncio_detailed as tag_archive,
)
from jupiter_webapi_client.api.tags.tag_create import (
    asyncio_detailed as tag_create,
)
from jupiter_webapi_client.api.tags.tag_find import (
    asyncio_detailed as tag_find,
)
from jupiter_webapi_client.api.tags.tag_link_upsert import (
    asyncio_detailed as tag_link_upsert,
)
from jupiter_webapi_client.api.tags.tag_load import (
    asyncio_detailed as tag_load,
)
from jupiter_webapi_client.api.tags.tag_remove import (
    asyncio_detailed as tag_remove,
)
from jupiter_webapi_client.api.tags.tag_update import (
    asyncio_detailed as tag_update,
)

# --- Time Events API ---
from jupiter_webapi_client.api.time_events.time_event_full_days_block_load import (
    asyncio_detailed as time_event_full_days_block_load,
)
from jupiter_webapi_client.api.time_events.time_event_in_day_block_archive import (
    asyncio_detailed as time_event_in_day_block_archive,
)
from jupiter_webapi_client.api.time_events.time_event_in_day_block_create_for_big_plan import (
    asyncio_detailed as time_event_in_day_block_create_for_big_plan,
)
from jupiter_webapi_client.api.time_events.time_event_in_day_block_create_for_inbox_task import (
    asyncio_detailed as time_event_in_day_block_create_for_inbox_task,
)
from jupiter_webapi_client.api.time_events.time_event_in_day_block_create_for_todo_task import (
    asyncio_detailed as time_event_in_day_block_create_for_todo_task,
)
from jupiter_webapi_client.api.time_events.time_event_in_day_block_create_for_habit import (
    asyncio_detailed as time_event_in_day_block_create_for_habit,
)
from jupiter_webapi_client.api.time_events.time_event_in_day_block_create_for_chore import (
    asyncio_detailed as time_event_in_day_block_create_for_chore,
)
from jupiter_webapi_client.api.time_events.time_event_in_day_block_load import (
    asyncio_detailed as time_event_in_day_block_load,
)
from jupiter_webapi_client.api.time_events.time_event_in_day_block_remove import (
    asyncio_detailed as time_event_in_day_block_remove,
)
from jupiter_webapi_client.api.time_events.time_event_in_day_block_update import (
    asyncio_detailed as time_event_in_day_block_update,
)
from jupiter_webapi_client.api.time_plans.time_plan_activity_archive import (
    asyncio_detailed as time_plan_activity_archive,
)
from jupiter_webapi_client.api.time_plans.time_plan_activity_find_for_target import (
    asyncio_detailed as time_plan_activity_find_for_target,
)
from jupiter_webapi_client.api.time_plans.time_plan_activity_load import (
    asyncio_detailed as time_plan_activity_load,
)
from jupiter_webapi_client.api.time_plans.time_plan_activity_remove import (
    asyncio_detailed as time_plan_activity_remove,
)
from jupiter_webapi_client.api.time_plans.time_plan_activity_update import (
    asyncio_detailed as time_plan_activity_update,
)

# --- Time Plans API ---
from jupiter_webapi_client.api.time_plans.time_plan_archive import (
    asyncio_detailed as time_plan_archive,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_big_plan_with_plan import (
    asyncio_detailed as time_plan_associate_big_plan_with_plan,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_inbox_task_with_plan import (
    asyncio_detailed as time_plan_associate_inbox_task_with_plan,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_with_activities import (
    asyncio_detailed as time_plan_associate_with_activities,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_with_big_plans import (
    asyncio_detailed as time_plan_associate_with_big_plans,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_with_inbox_tasks import (
    asyncio_detailed as time_plan_associate_with_inbox_tasks,
)
from jupiter_webapi_client.api.time_plans.time_plan_change_time_config import (
    asyncio_detailed as time_plan_change_time_config,
)
from jupiter_webapi_client.api.time_plans.time_plan_create import (
    asyncio_detailed as time_plan_create,
)
from jupiter_webapi_client.api.time_plans.time_plan_find import (
    asyncio_detailed as time_plan_find,
)
from jupiter_webapi_client.api.time_plans.time_plan_load import (
    asyncio_detailed as time_plan_load,
)
from jupiter_webapi_client.api.time_plans.time_plan_load_for_time_date_and_period import (
    asyncio_detailed as time_plan_load_for_date_and_period,
)
from jupiter_webapi_client.api.time_plans.time_plan_load_settings import (
    asyncio_detailed as time_plan_load_settings,
)
from jupiter_webapi_client.api.time_plans.time_plan_remove import (
    asyncio_detailed as time_plan_remove,
)
from jupiter_webapi_client.api.time_plans.time_plan_update_settings import (
    asyncio_detailed as time_plan_update_settings,
)

# --- Todo API ---
from jupiter_webapi_client.api.todo.todo_task_archive import (
    asyncio_detailed as todo_task_archive,
)
from jupiter_webapi_client.api.todo.todo_task_create import (
    asyncio_detailed as todo_task_create,
)
from jupiter_webapi_client.api.todo.todo_task_find import (
    asyncio_detailed as todo_task_find,
)
from jupiter_webapi_client.api.todo.todo_task_load import (
    asyncio_detailed as todo_task_load,
)
from jupiter_webapi_client.api.todo.todo_task_remove import (
    asyncio_detailed as todo_task_remove,
)
from jupiter_webapi_client.api.todo.todo_task_update import (
    asyncio_detailed as todo_task_update,
)

# --- Vacations API ---
from jupiter_webapi_client.api.vacations.vacation_archive import (
    asyncio_detailed as vacation_archive,
)
from jupiter_webapi_client.api.vacations.vacation_create import (
    asyncio_detailed as vacation_create,
)
from jupiter_webapi_client.api.vacations.vacation_find import (
    asyncio_detailed as vacation_find,
)
from jupiter_webapi_client.api.vacations.vacation_load import (
    asyncio_detailed as vacation_load,
)
from jupiter_webapi_client.api.vacations.vacation_remove import (
    asyncio_detailed as vacation_remove,
)
from jupiter_webapi_client.api.vacations.vacation_update import (
    asyncio_detailed as vacation_update,
)

# --- Working Mem API ---
from jupiter_webapi_client.api.working_mem.working_mem_load_current import (
    asyncio_detailed as working_mem_load_current,
)
from jupiter_webapi_client.api.working_mem.working_mem_load_settings import (
    asyncio_detailed as working_mem_load_settings,
)
from jupiter_webapi_client.api.working_mem.working_mem_update_settings import (
    asyncio_detailed as working_mem_update_settings,
)
from rich import print as rich_print


async def main() -> None:
    """Application main function."""
    global_properties = build_global_properties()
    service_properties = build_mcp_properties()

    telemetry: Telemetry

    if (
        global_properties.env.is_live
        and global_properties.universe.hosting.is_hosted_global
    ):
        telemetry = SentryTelemetry(service_properties.sentry_dsn)
    else:
        telemetry = LocalTelemetry()

    telemetry.prepare()

    webapi_client = WebApiClient(global_properties, service_properties.webapi_url)
    ports = JupiterMcpPorts(webapi_client=webapi_client)
    rich_print("=" * 80)

    mcp_service = JupiterMcpService.build(
        ports,
        global_properties,
        service_properties,
        # --- Inbox Tasks ---
        JupiterMcpResource.resource("jupiter://inbox-tasks", inbox_task_find),
        JupiterMcpTool.tool("find-inbox-tasks", "Find inbox tasks", inbox_task_find),
        JupiterMcpTool.tool("load-inbox-task", "Load an inbox task", inbox_task_load),
        JupiterMcpTool.tool(
            "update-inbox-task", "Update an inbox task", inbox_task_update
        ),
        JupiterMcpTool.tool(
            "archive-inbox-task", "Archive an inbox task", inbox_task_archive
        ),
        JupiterMcpTool.tool(
            "remove-inbox-task", "Remove an inbox task", inbox_task_remove
        ),
        # --- Working Mem ---
        JupiterMcpResource.resource("jupiter://working-mem", working_mem_load_current),
        JupiterMcpTool.tool(
            "load-working-mem",
            "Load the current working memory",
            working_mem_load_current,
        ),
        JupiterMcpTool.tool(
            "load-working-mem-settings",
            "Load working memory settings",
            working_mem_load_settings,
        ),
        JupiterMcpTool.tool(
            "update-working-mem-settings",
            "Update working memory settings",
            working_mem_update_settings,
        ),
        # --- Time Plans ---
        JupiterMcpResource.resource("jupiter://time-plans", time_plan_find),
        JupiterMcpTool.tool("find-time-plans", "Find time plans", time_plan_find),
        JupiterMcpTool.tool("create-time-plan", "Create a time plan", time_plan_create),
        JupiterMcpTool.tool("load-time-plan", "Load a time plan", time_plan_load),
        JupiterMcpTool.tool(
            "archive-time-plan", "Archive a time plan", time_plan_archive
        ),
        JupiterMcpTool.tool("remove-time-plan", "Remove a time plan", time_plan_remove),
        JupiterMcpTool.tool(
            "load-time-plan-for-date-and-period",
            "Load a time plan for a specific date and period",
            time_plan_load_for_date_and_period,
        ),
        JupiterMcpTool.tool(
            "load-time-plan-settings",
            "Load time plan settings",
            time_plan_load_settings,
        ),
        JupiterMcpTool.tool(
            "update-time-plan-settings",
            "Update time plan settings",
            time_plan_update_settings,
        ),
        JupiterMcpTool.tool(
            "change-time-plan-time-config",
            "Change the time configuration of a time plan",
            time_plan_change_time_config,
        ),
        JupiterMcpTool.tool(
            "associate-big-plan-with-time-plan",
            "Associate a big plan with a time plan",
            time_plan_associate_big_plan_with_plan,
        ),
        JupiterMcpTool.tool(
            "associate-inbox-task-with-time-plan",
            "Associate an inbox task with a time plan",
            time_plan_associate_inbox_task_with_plan,
        ),
        JupiterMcpTool.tool(
            "associate-time-plan-with-activities",
            "Associate a time plan with activities",
            time_plan_associate_with_activities,
        ),
        JupiterMcpTool.tool(
            "associate-time-plan-with-big-plans",
            "Associate a time plan with big plans",
            time_plan_associate_with_big_plans,
        ),
        JupiterMcpTool.tool(
            "associate-time-plan-with-inbox-tasks",
            "Associate a time plan with inbox tasks",
            time_plan_associate_with_inbox_tasks,
        ),
        # --- Time Plan Activities ---
        JupiterMcpTool.tool(
            "find-time-plan-activity-for-target",
            "Find a time plan activity for a target",
            time_plan_activity_find_for_target,
        ),
        JupiterMcpTool.tool(
            "load-time-plan-activity",
            "Load a time plan activity",
            time_plan_activity_load,
        ),
        JupiterMcpTool.tool(
            "update-time-plan-activity",
            "Update a time plan activity",
            time_plan_activity_update,
        ),
        JupiterMcpTool.tool(
            "archive-time-plan-activity",
            "Archive a time plan activity",
            time_plan_activity_archive,
        ),
        JupiterMcpTool.tool(
            "remove-time-plan-activity",
            "Remove a time plan activity",
            time_plan_activity_remove,
        ),
        # --- Schedule Streams ---
        JupiterMcpResource.resource("jupiter://schedule/streams", schedule_stream_find),
        JupiterMcpTool.tool(
            "find-schedule-streams", "Find schedule streams", schedule_stream_find
        ),
        JupiterMcpTool.tool(
            "create-schedule-stream-for-user",
            "Create a user schedule stream",
            schedule_stream_create_for_user,
        ),
        JupiterMcpTool.tool(
            "create-schedule-stream-for-external-ical",
            "Create a schedule stream from an external iCal feed",
            schedule_stream_create_for_external_ical,
        ),
        JupiterMcpTool.tool(
            "load-schedule-stream", "Load a schedule stream", schedule_stream_load
        ),
        JupiterMcpTool.tool(
            "update-schedule-stream", "Update a schedule stream", schedule_stream_update
        ),
        JupiterMcpTool.tool(
            "archive-schedule-stream",
            "Archive a schedule stream",
            schedule_stream_archive,
        ),
        JupiterMcpTool.tool(
            "remove-schedule-stream", "Remove a schedule stream", schedule_stream_remove
        ),
        # --- Schedule Exports ---
        JupiterMcpResource.resource("jupiter://schedule/exports", schedule_export_find),
        JupiterMcpTool.tool(
            "find-schedule-exports", "Find schedule exports", schedule_export_find
        ),
        JupiterMcpTool.tool(
            "create-schedule-export", "Create a schedule export", schedule_export_create
        ),
        JupiterMcpTool.tool(
            "load-schedule-export", "Load a schedule export", schedule_export_load
        ),
        JupiterMcpTool.tool(
            "update-schedule-export", "Update a schedule export", schedule_export_update
        ),
        JupiterMcpTool.tool(
            "archive-schedule-export",
            "Archive a schedule export",
            schedule_export_archive,
        ),
        JupiterMcpTool.tool(
            "remove-schedule-export", "Remove a schedule export", schedule_export_remove
        ),
        # --- Schedule Events (Full Days) ---
        JupiterMcpTool.tool(
            "create-schedule-event-full-days",
            "Create a full-day schedule event",
            schedule_event_full_days_create,
        ),
        JupiterMcpTool.tool(
            "load-schedule-event-full-days",
            "Load a full-day schedule event",
            schedule_event_full_days_load,
        ),
        JupiterMcpTool.tool(
            "update-schedule-event-full-days",
            "Update a full-day schedule event",
            schedule_event_full_days_update,
        ),
        JupiterMcpTool.tool(
            "archive-schedule-event-full-days",
            "Archive a full-day schedule event",
            schedule_event_full_days_archive,
        ),
        JupiterMcpTool.tool(
            "remove-schedule-event-full-days",
            "Remove a full-day schedule event",
            schedule_event_full_days_remove,
        ),
        JupiterMcpTool.tool(
            "change-schedule-event-full-days-stream",
            "Change the stream of a full-day schedule event",
            schedule_event_full_days_change_schedule_stream,
        ),
        # --- Schedule Events (In Day) ---
        JupiterMcpTool.tool(
            "create-schedule-event-in-day",
            "Create an in-day schedule event",
            schedule_event_in_day_create,
        ),
        JupiterMcpTool.tool(
            "load-schedule-event-in-day",
            "Load an in-day schedule event",
            schedule_event_in_day_load,
        ),
        JupiterMcpTool.tool(
            "update-schedule-event-in-day",
            "Update an in-day schedule event",
            schedule_event_in_day_update,
        ),
        JupiterMcpTool.tool(
            "archive-schedule-event-in-day",
            "Archive an in-day schedule event",
            schedule_event_in_day_archive,
        ),
        JupiterMcpTool.tool(
            "remove-schedule-event-in-day",
            "Remove an in-day schedule event",
            schedule_event_in_day_remove,
        ),
        JupiterMcpTool.tool(
            "change-schedule-event-in-day-stream",
            "Change the stream of an in-day schedule event",
            schedule_event_in_day_change_schedule_stream,
        ),
        # --- Habits ---
        JupiterMcpResource.resource("jupiter://habits", habit_find),
        JupiterMcpTool.tool("find-habits", "Find habits", habit_find),
        JupiterMcpTool.tool("create-habit", "Create a habit", habit_create),
        JupiterMcpTool.tool("load-habit", "Load a habit", habit_load),
        JupiterMcpTool.tool("update-habit", "Update a habit", habit_update),
        JupiterMcpTool.tool("archive-habit", "Archive a habit", habit_archive),
        JupiterMcpTool.tool("remove-habit", "Remove a habit", habit_remove),
        JupiterMcpTool.tool("suspend-habit", "Suspend a habit", habit_suspend),
        JupiterMcpTool.tool("unsuspend-habit", "Unsuspend a habit", habit_unsuspend),
        # --- Chores ---
        JupiterMcpResource.resource("jupiter://chores", chore_find),
        JupiterMcpTool.tool("find-chores", "Find chores", chore_find),
        JupiterMcpTool.tool("create-chore", "Create a chore", chore_create),
        JupiterMcpTool.tool("load-chore", "Load a chore", chore_load),
        JupiterMcpTool.tool("update-chore", "Update a chore", chore_update),
        JupiterMcpTool.tool("archive-chore", "Archive a chore", chore_archive),
        JupiterMcpTool.tool("remove-chore", "Remove a chore", chore_remove),
        JupiterMcpTool.tool("suspend-chore", "Suspend a chore", chore_suspend),
        JupiterMcpTool.tool("unsuspend-chore", "Unsuspend a chore", chore_unsuspend),
        # --- Big Plans ---
        JupiterMcpResource.resource("jupiter://big-plans", big_plan_find),
        JupiterMcpTool.tool("find-big-plans", "Find big plans", big_plan_find),
        JupiterMcpTool.tool("create-big-plan", "Create a big plan", big_plan_create),
        JupiterMcpTool.tool("load-big-plan", "Load a big plan", big_plan_load),
        JupiterMcpTool.tool("update-big-plan", "Update a big plan", big_plan_update),
        JupiterMcpTool.tool("archive-big-plan", "Archive a big plan", big_plan_archive),
        JupiterMcpTool.tool("remove-big-plan", "Remove a big plan", big_plan_remove),
        JupiterMcpTool.tool(
            "create-inbox-task-for-big-plan",
            "Create an inbox task for a big plan",
            big_plan_create_inbox_task,
        ),
        # --- Big Plan Milestones ---
        JupiterMcpTool.tool(
            "create-big-plan-milestone",
            "Create a milestone for a big plan",
            big_plan_milestone_create,
        ),
        JupiterMcpTool.tool(
            "load-big-plan-milestone",
            "Load a big plan milestone",
            big_plan_milestone_load,
        ),
        JupiterMcpTool.tool(
            "update-big-plan-milestone",
            "Update a big plan milestone",
            big_plan_milestone_update,
        ),
        JupiterMcpTool.tool(
            "archive-big-plan-milestone",
            "Archive a big plan milestone",
            big_plan_milestone_archive,
        ),
        JupiterMcpTool.tool(
            "remove-big-plan-milestone",
            "Remove a big plan milestone",
            big_plan_milestone_remove,
        ),
        # --- Docs ---
        JupiterMcpResource.resource("jupiter://docs", doc_find),
        JupiterMcpTool.tool("find-docs", "Find docs", doc_find),
        JupiterMcpTool.tool("create-doc", "Create a doc", doc_create),
        JupiterMcpTool.tool("load-doc", "Load a doc", doc_load),
        JupiterMcpTool.tool("update-doc", "Update a doc", doc_update),
        JupiterMcpTool.tool("archive-doc", "Archive a doc", doc_archive),
        JupiterMcpTool.tool("remove-doc", "Remove a doc", doc_remove),
        # --- Journals ---
        JupiterMcpResource.resource("jupiter://journals", journal_find),
        JupiterMcpTool.tool("find-journals", "Find journals", journal_find),
        JupiterMcpTool.tool("create-journal", "Create a journal", journal_create),
        JupiterMcpTool.tool("load-journal", "Load a journal", journal_load),
        JupiterMcpTool.tool("archive-journal", "Archive a journal", journal_archive),
        JupiterMcpTool.tool("remove-journal", "Remove a journal", journal_remove),
        JupiterMcpTool.tool(
            "load-journal-for-date-and-period",
            "Load a journal for a specific date and period",
            journal_load_for_date_and_period,
        ),
        JupiterMcpTool.tool(
            "load-journal-settings", "Load journal settings", journal_load_settings
        ),
        JupiterMcpTool.tool(
            "update-journal-settings",
            "Update journal settings",
            journal_update_settings,
        ),
        JupiterMcpTool.tool(
            "change-journal-time-config",
            "Change the time configuration of a journal",
            journal_change_time_config,
        ),
        # --- Life Plan ---
        JupiterMcpTool.tool(
            "update-life-plan", "Update the life plan", life_plan_update
        ),
        # --- Visions ---
        JupiterMcpResource.resource("jupiter://life-plan/visions", vision_find),
        JupiterMcpTool.tool("find-visions", "Find visions", vision_find),
        JupiterMcpTool.tool(
            "create-vision-draft", "Create a draft vision", vision_create_draft
        ),
        JupiterMcpTool.tool("load-vision", "Load a vision", vision_load),
        JupiterMcpTool.tool(
            "load-active-vision", "Load the active vision", vision_load_active
        ),
        JupiterMcpTool.tool("archive-vision", "Archive a vision", vision_archive),
        JupiterMcpTool.tool("remove-vision", "Remove a vision", vision_remove),
        JupiterMcpTool.tool(
            "mark-vision-draft-as-active",
            "Mark a draft vision as active",
            vision_mark_draft_as_active,
        ),
        # --- Chapters ---
        JupiterMcpResource.resource("jupiter://life-plan/chapters", chapter_find),
        JupiterMcpTool.tool("find-chapters", "Find chapters", chapter_find),
        JupiterMcpTool.tool("create-chapter", "Create a chapter", chapter_create),
        JupiterMcpTool.tool("load-chapter", "Load a chapter", chapter_load),
        JupiterMcpTool.tool("update-chapter", "Update a chapter", chapter_update),
        JupiterMcpTool.tool("archive-chapter", "Archive a chapter", chapter_archive),
        JupiterMcpTool.tool("remove-chapter", "Remove a chapter", chapter_remove),
        # --- Goals ---
        JupiterMcpResource.resource("jupiter://life-plan/goals", goal_find),
        JupiterMcpTool.tool("find-goals", "Find goals", goal_find),
        JupiterMcpTool.tool("create-goal", "Create a goal", goal_create),
        JupiterMcpTool.tool("load-goal", "Load a goal", goal_load),
        JupiterMcpTool.tool("update-goal", "Update a goal", goal_update),
        JupiterMcpTool.tool("archive-goal", "Archive a goal", goal_archive),
        JupiterMcpTool.tool("remove-goal", "Remove a goal", goal_remove),
        # --- Milestones (Life Plan) ---
        JupiterMcpResource.resource("jupiter://life-plan/milestones", milestone_find),
        JupiterMcpTool.tool("find-milestones", "Find milestones", milestone_find),
        JupiterMcpTool.tool("create-milestone", "Create a milestone", milestone_create),
        JupiterMcpTool.tool("load-milestone", "Load a milestone", milestone_load),
        JupiterMcpTool.tool("update-milestone", "Update a milestone", milestone_update),
        JupiterMcpTool.tool(
            "archive-milestone", "Archive a milestone", milestone_archive
        ),
        JupiterMcpTool.tool("remove-milestone", "Remove a milestone", milestone_remove),
        # --- Aspects ---
        JupiterMcpResource.resource("jupiter://life-plan/aspects", aspect_find),
        JupiterMcpTool.tool("find-aspects", "Find aspects", aspect_find),
        JupiterMcpTool.tool("create-aspect", "Create a aspect", aspect_create),
        JupiterMcpTool.tool("load-aspect", "Load a aspect", aspect_load),
        JupiterMcpTool.tool("update-aspect", "Update a aspect", aspect_update),
        JupiterMcpTool.tool("archive-aspect", "Archive a aspect", aspect_archive),
        JupiterMcpTool.tool("remove-aspect", "Remove a aspect", aspect_remove),
        JupiterMcpTool.tool(
            "reorder-aspect-children",
            "Reorder children of a aspect",
            aspect_reorder_children,
        ),
        # --- Metrics ---
        JupiterMcpResource.resource("jupiter://metrics", metric_find),
        JupiterMcpTool.tool("find-metrics", "Find metrics", metric_find),
        JupiterMcpTool.tool("create-metric", "Create a metric", metric_create),
        JupiterMcpTool.tool("load-metric", "Load a metric", metric_load),
        JupiterMcpTool.tool("update-metric", "Update a metric", metric_update),
        JupiterMcpTool.tool("archive-metric", "Archive a metric", metric_archive),
        JupiterMcpTool.tool("remove-metric", "Remove a metric", metric_remove),
        JupiterMcpTool.tool(
            "load-metric-settings", "Load metric settings", metric_load_settings
        ),
        # --- Metric Entries ---
        JupiterMcpTool.tool(
            "create-metric-entry", "Create a metric entry", metric_entry_create
        ),
        JupiterMcpTool.tool(
            "load-metric-entry", "Load a metric entry", metric_entry_load
        ),
        JupiterMcpTool.tool(
            "update-metric-entry", "Update a metric entry", metric_entry_update
        ),
        JupiterMcpTool.tool(
            "archive-metric-entry", "Archive a metric entry", metric_entry_archive
        ),
        JupiterMcpTool.tool(
            "remove-metric-entry", "Remove a metric entry", metric_entry_remove
        ),
        # --- PRM ---
        JupiterMcpTool.tool(
            "load-person-settings", "Load PRM person settings", person_load_settings
        ),
        # --- Persons ---
        JupiterMcpResource.resource("jupiter://prm/persons", person_find),
        JupiterMcpTool.tool("find-persons", "Find persons", person_find),
        JupiterMcpTool.tool("create-person", "Create a person", person_create),
        JupiterMcpTool.tool("load-person", "Load a person", person_load),
        JupiterMcpTool.tool("update-person", "Update a person", person_update),
        JupiterMcpTool.tool("archive-person", "Archive a person", person_archive),
        JupiterMcpTool.tool("remove-person", "Remove a person", person_remove),
        # --- Occasions ---
        JupiterMcpTool.tool(
            "create-occasion", "Create an occasion for a person", occasion_create
        ),
        JupiterMcpTool.tool("load-occasion", "Load an occasion", occasion_load),
        JupiterMcpTool.tool("update-occasion", "Update an occasion", occasion_update),
        JupiterMcpTool.tool(
            "archive-occasion", "Archive an occasion", occasion_archive
        ),
        JupiterMcpTool.tool("remove-occasion", "Remove an occasion", occasion_remove),
        # --- Circles ---
        JupiterMcpResource.resource("jupiter://prm/circles", circle_find),
        JupiterMcpTool.tool("find-circles", "Find circles", circle_find),
        JupiterMcpTool.tool("create-circle", "Create a circle", circle_create),
        JupiterMcpTool.tool("load-circle", "Load a circle", circle_load),
        JupiterMcpTool.tool("update-circle", "Update a circle", circle_update),
        JupiterMcpTool.tool("archive-circle", "Archive a circle", circle_archive),
        JupiterMcpTool.tool("remove-circle", "Remove a circle", circle_remove),
        # --- Smart Lists ---
        JupiterMcpResource.resource("jupiter://smart-lists", smart_list_find),
        JupiterMcpTool.tool("find-smart-lists", "Find smart lists", smart_list_find),
        JupiterMcpTool.tool(
            "create-smart-list", "Create a smart list", smart_list_create
        ),
        JupiterMcpTool.tool("load-smart-list", "Load a smart list", smart_list_load),
        JupiterMcpTool.tool(
            "update-smart-list", "Update a smart list", smart_list_update
        ),
        JupiterMcpTool.tool(
            "archive-smart-list", "Archive a smart list", smart_list_archive
        ),
        JupiterMcpTool.tool(
            "remove-smart-list", "Remove a smart list", smart_list_remove
        ),
        # --- Smart List Items ---
        JupiterMcpTool.tool(
            "create-smart-list-item", "Create a smart list item", smart_list_item_create
        ),
        JupiterMcpTool.tool(
            "load-smart-list-item", "Load a smart list item", smart_list_item_load
        ),
        JupiterMcpTool.tool(
            "update-smart-list-item", "Update a smart list item", smart_list_item_update
        ),
        JupiterMcpTool.tool(
            "archive-smart-list-item",
            "Archive a smart list item",
            smart_list_item_archive,
        ),
        JupiterMcpTool.tool(
            "remove-smart-list-item", "Remove a smart list item", smart_list_item_remove
        ),
        # --- Vacations ---
        JupiterMcpResource.resource("jupiter://vacations", vacation_find),
        JupiterMcpTool.tool("find-vacations", "Find vacations", vacation_find),
        JupiterMcpTool.tool("create-vacation", "Create a vacation", vacation_create),
        JupiterMcpTool.tool("load-vacation", "Load a vacation", vacation_load),
        JupiterMcpTool.tool("update-vacation", "Update a vacation", vacation_update),
        JupiterMcpTool.tool("archive-vacation", "Archive a vacation", vacation_archive),
        JupiterMcpTool.tool("remove-vacation", "Remove a vacation", vacation_remove),
        # --- Todo ---
        JupiterMcpResource.resource("jupiter://todos", todo_task_find),
        JupiterMcpTool.tool("find-todos", "Find todo tasks", todo_task_find),
        JupiterMcpTool.tool("create-todo", "Create a todo task", todo_task_create),
        JupiterMcpTool.tool("load-todo", "Load a todo task", todo_task_load),
        JupiterMcpTool.tool("update-todo", "Update a todo task", todo_task_update),
        JupiterMcpTool.tool("archive-todo", "Archive a todo task", todo_task_archive),
        JupiterMcpTool.tool("remove-todo", "Remove a todo task", todo_task_remove),
        # --- Notes ---
        JupiterMcpResource.resource("jupiter://notes", note_find),
        JupiterMcpTool.tool("find-notes", "Find notes", note_find),
        JupiterMcpTool.tool("create-note", "Create a note", note_create),
        JupiterMcpTool.tool("load-note", "Load a note", note_load),
        JupiterMcpTool.tool("update-note", "Update a note", note_update),
        JupiterMcpTool.tool("archive-note", "Archive a note", note_archive),
        JupiterMcpTool.tool("remove-note", "Remove a note", note_remove),
        # --- Tags ---
        JupiterMcpResource.resource("jupiter://tags", tag_find),
        JupiterMcpTool.tool("find-tags", "Find tags", tag_find),
        JupiterMcpTool.tool("create-tag", "Create a tag", tag_create),
        JupiterMcpTool.tool("load-tag", "Load a tag", tag_load),
        JupiterMcpTool.tool("update-tag", "Update a tag", tag_update),
        JupiterMcpTool.tool("archive-tag", "Archive a tag", tag_archive),
        JupiterMcpTool.tool("remove-tag", "Remove a tag", tag_remove),
        JupiterMcpTool.tool(
            "upsert-tag-link", "Create or update a tag link", tag_link_upsert
        ),
        # --- Contacts ---
        JupiterMcpResource.resource("jupiter://contacts", contact_find),
        JupiterMcpTool.tool("find-contacts", "Find contacts", contact_find),
        JupiterMcpTool.tool("create-contact", "Create a contact", contact_create),
        JupiterMcpTool.tool("load-contact", "Load a contact", contact_load),
        JupiterMcpTool.tool("update-contact", "Update a contact", contact_update),
        JupiterMcpTool.tool("archive-contact", "Archive a contact", contact_archive),
        JupiterMcpTool.tool("remove-contact", "Remove a contact", contact_remove),
        JupiterMcpTool.tool(
            "upsert-contact-link",
            "Create or update a contact link",
            contact_link_upsert,
        ),
        # --- Time Events ---
        JupiterMcpTool.tool(
            "load-time-event-full-days-block",
            "Load a full-days time event block",
            time_event_full_days_block_load,
        ),
        JupiterMcpTool.tool(
            "create-time-event-in-day-block-for-inbox-task",
            "Create an in-day time event block for an inbox task",
            time_event_in_day_block_create_for_inbox_task,
        ),
        JupiterMcpTool.tool(
            "create-time-event-in-day-block-for-big-plan",
            "Create an in-day time event block for a big plan",
            time_event_in_day_block_create_for_big_plan,
        ),
        JupiterMcpTool.tool(
            "create-time-event-in-day-block-for-todo-task",
            "Create an in-day time event block for a todo task",
            time_event_in_day_block_create_for_todo_task,
        ),
        JupiterMcpTool.tool(
            "create-time-event-in-day-block-for-habit",
            "Create an in-day time event block for a habit",
            time_event_in_day_block_create_for_habit,
        ),
        JupiterMcpTool.tool(
            "create-time-event-in-day-block-for-chore",
            "Create an in-day time event block for a chore",
            time_event_in_day_block_create_for_chore,
        ),
        JupiterMcpTool.tool(
            "load-time-event-in-day-block",
            "Load an in-day time event block",
            time_event_in_day_block_load,
        ),
        JupiterMcpTool.tool(
            "update-time-event-in-day-block",
            "Update an in-day time event block",
            time_event_in_day_block_update,
        ),
        JupiterMcpTool.tool(
            "archive-time-event-in-day-block",
            "Archive an in-day time event block",
            time_event_in_day_block_archive,
        ),
        JupiterMcpTool.tool(
            "remove-time-event-in-day-block",
            "Remove an in-day time event block",
            time_event_in_day_block_remove,
        ),
    )

    rich_print("=" * 80)
    rich_print("Starting Jupiter MCP:")
    rich_print(f"  Version: {global_properties.version}")
    rich_print(f"  Universe: {global_properties.universe}")
    rich_print(f"  Environment: {global_properties.env}")
    rich_print(f"  Instance: {global_properties.instance}")
    rich_print(f"  Hosting: {global_properties.universe.hosting}")

    await mcp_service.run()


def sync_main() -> None:
    """Run the main function synchronously."""
    asyncio.run(main())


if __name__ == "__main__":
    sync_main()
