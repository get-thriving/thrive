"""The Jupiter MCP server."""

import asyncio

from jupiter.mcp.webapi_client import WebApiClient
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

# --- Big Plans API ---
from jupiter_webapi_client.api.big_plans.big_plan_archive import (
    asyncio_detailed as big_plan_archive,
)
from jupiter_webapi_client.api.big_plans.big_plan_create import (
    asyncio_detailed as big_plan_create,
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
from jupiter_webapi_client.api.inbox_tasks.inbox_task_create import (
    asyncio_detailed as inbox_task_create,
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
from jupiter_webapi_client.api.life_plan.project_archive import (
    asyncio_detailed as project_archive,
)
from jupiter_webapi_client.api.life_plan.project_create import (
    asyncio_detailed as project_create,
)
from jupiter_webapi_client.api.life_plan.project_find import (
    asyncio_detailed as project_find,
)
from jupiter_webapi_client.api.life_plan.project_load import (
    asyncio_detailed as project_load,
)
from jupiter_webapi_client.api.life_plan.project_remove import (
    asyncio_detailed as project_remove,
)
from jupiter_webapi_client.api.life_plan.project_reorder_children import (
    asyncio_detailed as project_reorder_children,
)
from jupiter_webapi_client.api.life_plan.project_update import (
    asyncio_detailed as project_update,
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
from jupiter_webapi_client.api.metrics.metric_change_collection_project import (
    asyncio_detailed as metric_change_collection_project,
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
from jupiter_webapi_client.api.prm.person_change_catch_up_project import (
    asyncio_detailed as person_change_catch_up_project,
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
        JupiterMcpResource.resource("jupiter://inbox-tasks", inbox_task_find),
        JupiterMcpTool.tool("find-inbox-tasks", "Find inbox tasks", inbox_task_find),
        JupiterMcpTool.tool("create-inbox-task", "Create an inbox task", inbox_task_create),
        JupiterMcpTool.tool("load-inbox-task", "Load an inbox task", inbox_task_load),
        JupiterMcpTool.tool("update-inbox-task", "Update an inbox task", inbox_task_update),
        JupiterMcpTool.tool("archive-inbox-task", "Archive an inbox task", inbox_task_archive),
        JupiterMcpTool.tool("remove-inbox-task", "Remove an inbox task", inbox_task_remove),   
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
