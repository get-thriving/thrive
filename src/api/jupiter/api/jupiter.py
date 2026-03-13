"""The Jupiter external API."""

import asyncio

from jupiter.api.config import (
    JupiterApiGatewayMethod,
    JupiterApiPorts,
    JupiterApiResource,
    JupiterApiService,
    build_api_properties,
)
from jupiter.api.webapi_client import WebApiClient
from jupiter.core.config import build_global_properties
from jupiter.framework.telemetry.local.local import LocalTelemetry
from jupiter.framework.telemetry.sentry.sentry import SentryTelemetry
from jupiter.framework.telemetry.telemetry import Telemetry
from jupiter.framework.time_provider import CronRunTimeProvider, PerRequestTimeProvider

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
from jupiter_webapi_client.api.life_plan.life_plan_load_eval_settings import (
    asyncio_detailed as life_plan_load_eval_settings,
)
from jupiter_webapi_client.api.life_plan.life_plan_regen import (
    asyncio_detailed as life_plan_regen,
)
from jupiter_webapi_client.api.life_plan.life_plan_update import (
    asyncio_detailed as life_plan_update,
)
from jupiter_webapi_client.api.life_plan.life_plan_update_eval_settings import (
    asyncio_detailed as life_plan_update_eval_settings,
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
from jupiter_webapi_client.api.metrics.metric_change_collection_aspect import (
    asyncio_detailed as metric_change_collection_aspect,
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
from jupiter_webapi_client.api.prm.person_change_catch_up_aspect import (
    asyncio_detailed as person_change_catch_up_aspect,
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
    service_properties = build_api_properties()

    request_time_provider = PerRequestTimeProvider()
    cron_run_time_provider = CronRunTimeProvider()

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

    ports = JupiterApiPorts(
        webapi_client=webapi_client,
    )

    api_service = JupiterApiService.build(
        ports,
        global_properties,
        service_properties,
        request_time_provider,
        cron_run_time_provider,
        # Inbox Tasks
        JupiterApiResource.build(
            "inbox-tasks",
            JupiterApiGatewayMethod.get(inbox_task_find),
            JupiterApiGatewayMethod.post(inbox_task_create),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(inbox_task_load),
                JupiterApiGatewayMethod.put(inbox_task_update),
                JupiterApiGatewayMethod.delete(inbox_task_archive),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(inbox_task_remove),
                ),
            ),
        ),
        # Working Mem
        JupiterApiResource.build(
            "working-mem",
            JupiterApiGatewayMethod.get(working_mem_load_current),
            JupiterApiResource.build(
                "settings",
                JupiterApiGatewayMethod.get(working_mem_load_settings),
                JupiterApiGatewayMethod.put(working_mem_update_settings),
            ),
        ),
        # Time Plans
        JupiterApiResource.build(
            "time-plans",
            JupiterApiGatewayMethod.get(time_plan_find),
            JupiterApiGatewayMethod.post(time_plan_create),
            JupiterApiResource.build(
                "settings",
                JupiterApiGatewayMethod.get(time_plan_load_settings),
                JupiterApiGatewayMethod.put(time_plan_update_settings),
            ),
            JupiterApiResource.build(
                "for-date-and-period",
                JupiterApiGatewayMethod.get(time_plan_load_for_date_and_period),
            ),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(time_plan_load),
                JupiterApiGatewayMethod.delete(time_plan_archive),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(time_plan_remove),
                ),
                JupiterApiResource.build(
                    "change-time-config",
                    JupiterApiGatewayMethod.post(time_plan_change_time_config),
                ),
                JupiterApiResource.build(
                    "associate-big-plan",
                    JupiterApiGatewayMethod.post(
                        time_plan_associate_big_plan_with_plan,
                    ),
                ),
                JupiterApiResource.build(
                    "associate-inbox-task",
                    JupiterApiGatewayMethod.post(
                        time_plan_associate_inbox_task_with_plan,
                    ),
                ),
                JupiterApiResource.build(
                    "associate-with-activities",
                    JupiterApiGatewayMethod.post(
                        time_plan_associate_with_activities,
                    ),
                ),
                JupiterApiResource.build(
                    "associate-with-big-plans",
                    JupiterApiGatewayMethod.post(
                        time_plan_associate_with_big_plans,
                    ),
                ),
                JupiterApiResource.build(
                    "associate-with-inbox-tasks",
                    JupiterApiGatewayMethod.post(
                        time_plan_associate_with_inbox_tasks,
                    ),
                ),
                JupiterApiResource.build(
                    "activities",
                    JupiterApiResource.build(
                        "find-for-target",
                        JupiterApiGatewayMethod.get(
                            time_plan_activity_find_for_target,
                        ),
                    ),
                    JupiterApiResource.build(
                        ":activities:ref_id",
                        JupiterApiGatewayMethod.get(time_plan_activity_load),
                        JupiterApiGatewayMethod.put(time_plan_activity_update),
                        JupiterApiGatewayMethod.delete(time_plan_activity_archive),
                        JupiterApiResource.build(
                            "remove",
                            JupiterApiGatewayMethod.delete(
                                time_plan_activity_remove,
                            ),
                        ),
                    ),
                ),
            ),
        ),
        # Schedule
        JupiterApiResource.build(
            "schedule",
            JupiterApiResource.build(
                "streams",
                JupiterApiGatewayMethod.get(schedule_stream_find),
                JupiterApiResource.build(
                    "for-user",
                    JupiterApiGatewayMethod.post(schedule_stream_create_for_user),
                ),
                JupiterApiResource.build(
                    "for-external-ical",
                    JupiterApiGatewayMethod.post(
                        schedule_stream_create_for_external_ical,
                    ),
                ),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(schedule_stream_load),
                    JupiterApiGatewayMethod.put(schedule_stream_update),
                    JupiterApiGatewayMethod.delete(schedule_stream_archive),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(schedule_stream_remove),
                    ),
                ),
            ),
            JupiterApiResource.build(
                "events-full-days",
                JupiterApiGatewayMethod.post(schedule_event_full_days_create),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(schedule_event_full_days_load),
                    JupiterApiGatewayMethod.put(schedule_event_full_days_update),
                    JupiterApiGatewayMethod.delete(schedule_event_full_days_archive),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(
                            schedule_event_full_days_remove,
                        ),
                    ),
                    JupiterApiResource.build(
                        "change-stream",
                        JupiterApiGatewayMethod.post(
                            schedule_event_full_days_change_schedule_stream,
                        ),
                    ),
                ),
            ),
            JupiterApiResource.build(
                "events-in-day",
                JupiterApiGatewayMethod.post(schedule_event_in_day_create),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(schedule_event_in_day_load),
                    JupiterApiGatewayMethod.put(schedule_event_in_day_update),
                    JupiterApiGatewayMethod.delete(schedule_event_in_day_archive),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(schedule_event_in_day_remove),
                    ),
                    JupiterApiResource.build(
                        "change-stream",
                        JupiterApiGatewayMethod.post(
                            schedule_event_in_day_change_schedule_stream,
                        ),
                    ),
                ),
            ),
        ),
        # Habits
        JupiterApiResource.build(
            "habits",
            JupiterApiGatewayMethod.get(habit_find),
            JupiterApiGatewayMethod.post(habit_create),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(habit_load),
                JupiterApiGatewayMethod.put(habit_update),
                JupiterApiGatewayMethod.delete(habit_archive),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(habit_remove),
                ),
                JupiterApiResource.build(
                    "suspend",
                    JupiterApiGatewayMethod.post(habit_suspend),
                ),
                JupiterApiResource.build(
                    "unsuspend",
                    JupiterApiGatewayMethod.post(habit_unsuspend),
                ),
            ),
        ),
        # Chores
        JupiterApiResource.build(
            "chores",
            JupiterApiGatewayMethod.get(chore_find),
            JupiterApiGatewayMethod.post(chore_create),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(chore_load),
                JupiterApiGatewayMethod.put(chore_update),
                JupiterApiGatewayMethod.delete(chore_archive),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(chore_remove),
                ),
                JupiterApiResource.build(
                    "suspend",
                    JupiterApiGatewayMethod.post(chore_suspend),
                ),
                JupiterApiResource.build(
                    "unsuspend",
                    JupiterApiGatewayMethod.post(chore_unsuspend),
                ),
            ),
        ),
        # Big Plans
        JupiterApiResource.build(
            "big-plans",
            JupiterApiGatewayMethod.get(big_plan_find),
            JupiterApiGatewayMethod.post(big_plan_create),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(big_plan_load),
                JupiterApiGatewayMethod.put(big_plan_update),
                JupiterApiGatewayMethod.delete(big_plan_archive),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(big_plan_remove),
                ),
                JupiterApiResource.build(
                    "milestones",
                    JupiterApiGatewayMethod.post(big_plan_milestone_create),
                    JupiterApiResource.build(
                        ":milestones:ref_id",
                        JupiterApiGatewayMethod.get(big_plan_milestone_load),
                        JupiterApiGatewayMethod.put(big_plan_milestone_update),
                        JupiterApiGatewayMethod.delete(big_plan_milestone_archive),
                        JupiterApiResource.build(
                            "remove",
                            JupiterApiGatewayMethod.delete(
                                big_plan_milestone_remove,
                            ),
                        ),
                    ),
                ),
            ),
        ),
        # Docs
        JupiterApiResource.build(
            "docs",
            JupiterApiGatewayMethod.get(doc_find),
            JupiterApiGatewayMethod.post(doc_create),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(doc_load),
                JupiterApiGatewayMethod.put(doc_update),
                JupiterApiGatewayMethod.delete(doc_archive),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(doc_remove),
                ),
            ),
        ),
        # Journals
        JupiterApiResource.build(
            "journals",
            JupiterApiGatewayMethod.get(journal_find),
            JupiterApiGatewayMethod.post(journal_create),
            JupiterApiResource.build(
                "settings",
                JupiterApiGatewayMethod.get(journal_load_settings),
                JupiterApiGatewayMethod.put(journal_update_settings),
            ),
            JupiterApiResource.build(
                "for-date-and-period",
                JupiterApiGatewayMethod.get(journal_load_for_date_and_period),
            ),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(journal_load),
                JupiterApiGatewayMethod.delete(journal_archive),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(journal_remove),
                ),
                JupiterApiResource.build(
                    "change-time-config",
                    JupiterApiGatewayMethod.post(journal_change_time_config),
                ),
            ),
        ),
        # Life Plan
        JupiterApiResource.build(
            "life-plan",
            JupiterApiGatewayMethod.put(life_plan_update),
            JupiterApiResource.build(
                "settings",
                JupiterApiGatewayMethod.get(life_plan_load_eval_settings),
                JupiterApiGatewayMethod.put(life_plan_update_eval_settings),
                JupiterApiResource.build(
                    "regen",
                    JupiterApiGatewayMethod.post(life_plan_regen),
                ),
            ),
            JupiterApiResource.build(
                "visions",
                JupiterApiGatewayMethod.get(vision_find),
                JupiterApiResource.build(
                    "create-draft",
                    JupiterApiGatewayMethod.post(vision_create_draft),
                ),
                JupiterApiResource.build(
                    "active",
                    JupiterApiGatewayMethod.get(vision_load_active),
                ),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(vision_load),
                    JupiterApiGatewayMethod.delete(vision_archive),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(vision_remove),
                    ),
                    JupiterApiResource.build(
                        "mark-active",
                        JupiterApiGatewayMethod.post(vision_mark_draft_as_active),
                    ),
                ),
            ),
            JupiterApiResource.build(
                "chapters",
                JupiterApiGatewayMethod.get(chapter_find),
                JupiterApiGatewayMethod.post(chapter_create),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(chapter_load),
                    JupiterApiGatewayMethod.put(chapter_update),
                    JupiterApiGatewayMethod.delete(chapter_archive),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(chapter_remove),
                    ),
                ),
            ),
            JupiterApiResource.build(
                "goals",
                JupiterApiGatewayMethod.get(goal_find),
                JupiterApiGatewayMethod.post(goal_create),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(goal_load),
                    JupiterApiGatewayMethod.put(goal_update),
                    JupiterApiGatewayMethod.delete(goal_archive),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(goal_remove),
                    ),
                ),
            ),
            JupiterApiResource.build(
                "milestones",
                JupiterApiGatewayMethod.get(milestone_find),
                JupiterApiGatewayMethod.post(milestone_create),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(milestone_load),
                    JupiterApiGatewayMethod.put(milestone_update),
                    JupiterApiGatewayMethod.delete(milestone_archive),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(milestone_remove),
                    ),
                ),
            ),
            JupiterApiResource.build(
                "aspects",
                JupiterApiGatewayMethod.get(aspect_find),
                JupiterApiGatewayMethod.post(aspect_create),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(aspect_load),
                    JupiterApiGatewayMethod.put(aspect_update),
                    JupiterApiGatewayMethod.delete(aspect_archive),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(aspect_remove),
                    ),
                    JupiterApiResource.build(
                        "reorder-children",
                        JupiterApiGatewayMethod.post(aspect_reorder_children),
                    ),
                ),
            ),
        ),
        # Metrics
        JupiterApiResource.build(
            "metrics",
            JupiterApiGatewayMethod.get(metric_find),
            JupiterApiGatewayMethod.post(metric_create),
            JupiterApiResource.build(
                "settings",
                JupiterApiGatewayMethod.get(metric_load_settings),
            ),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(metric_load),
                JupiterApiGatewayMethod.put(metric_update),
                JupiterApiGatewayMethod.delete(metric_archive),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(metric_remove),
                ),
                JupiterApiResource.build(
                    "change-collection-aspect",
                    JupiterApiGatewayMethod.post(metric_change_collection_aspect),
                ),
                JupiterApiResource.build(
                    "entries",
                    JupiterApiGatewayMethod.post(metric_entry_create),
                    JupiterApiResource.build(
                        ":entries:ref_id",
                        JupiterApiGatewayMethod.get(metric_entry_load),
                        JupiterApiGatewayMethod.put(metric_entry_update),
                        JupiterApiGatewayMethod.delete(metric_entry_archive),
                        JupiterApiResource.build(
                            "remove",
                            JupiterApiGatewayMethod.delete(metric_entry_remove),
                        ),
                    ),
                ),
            ),
        ),
        # PRM
        JupiterApiResource.build(
            "prm",
            JupiterApiResource.build(
                "settings",
                JupiterApiGatewayMethod.get(person_load_settings),
            ),
            JupiterApiResource.build(
                "change-catch-up-aspect",
                JupiterApiGatewayMethod.post(person_change_catch_up_aspect),
            ),
            JupiterApiResource.build(
                "persons",
                JupiterApiGatewayMethod.get(person_find),
                JupiterApiGatewayMethod.post(person_create),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(person_load),
                    JupiterApiGatewayMethod.put(person_update),
                    JupiterApiGatewayMethod.delete(person_archive),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(person_remove),
                    ),
                    JupiterApiResource.build(
                        "occasions",
                        JupiterApiGatewayMethod.post(occasion_create),
                        JupiterApiResource.build(
                            ":occasions:ref_id",
                            JupiterApiGatewayMethod.get(occasion_load),
                            JupiterApiGatewayMethod.put(occasion_update),
                            JupiterApiGatewayMethod.delete(occasion_archive),
                            JupiterApiResource.build(
                                "remove",
                                JupiterApiGatewayMethod.delete(occasion_remove),
                            ),
                        ),
                    ),
                ),
            ),
            JupiterApiResource.build(
                "circles",
                JupiterApiGatewayMethod.get(circle_find),
                JupiterApiGatewayMethod.post(circle_create),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(circle_load),
                    JupiterApiGatewayMethod.put(circle_update),
                    JupiterApiGatewayMethod.delete(circle_archive),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(circle_remove),
                    ),
                ),
            ),
        ),
        # Smart Lists
        JupiterApiResource.build(
            "smart-lists",
            JupiterApiGatewayMethod.post(smart_list_create),
            JupiterApiGatewayMethod.get(smart_list_find),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(smart_list_load),
                JupiterApiGatewayMethod.put(smart_list_update),
                JupiterApiGatewayMethod.delete(smart_list_archive),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(smart_list_remove),
                ),
                JupiterApiResource.build(
                    "items",
                    JupiterApiGatewayMethod.post(smart_list_item_create),
                    JupiterApiResource.build(
                        ":items:ref_id",
                        JupiterApiGatewayMethod.get(smart_list_item_load),
                        JupiterApiGatewayMethod.put(smart_list_item_update),
                        JupiterApiGatewayMethod.delete(smart_list_item_archive),
                        JupiterApiResource.build(
                            "remove",
                            JupiterApiGatewayMethod.delete(smart_list_item_remove),
                        ),
                    ),
                ),
            ),
        ),
        # Vacations
        JupiterApiResource.build(
            "vacations",
            JupiterApiGatewayMethod.get(vacation_find),
            JupiterApiGatewayMethod.post(vacation_create),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(vacation_load),
                JupiterApiGatewayMethod.put(vacation_update),
                JupiterApiGatewayMethod.delete(vacation_archive),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(vacation_remove),
                ),
            ),
        ),
        JupiterApiResource.build(
            "common",
            # Notes
            JupiterApiResource.build(
                "notes",
                JupiterApiGatewayMethod.get(note_find),
                JupiterApiGatewayMethod.post(note_create),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(note_load),
                    JupiterApiGatewayMethod.put(note_update),
                    JupiterApiGatewayMethod.delete(note_archive),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(note_remove),
                    ),
                ),
            ),
            # Contacts
            JupiterApiResource.build(
                "contacts",
                JupiterApiGatewayMethod.get(contact_find),
                JupiterApiGatewayMethod.post(contact_create),
                JupiterApiResource.build(
                    "link",
                    JupiterApiGatewayMethod.post(contact_link_upsert),
                ),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(contact_load),
                    JupiterApiGatewayMethod.put(contact_update),
                    JupiterApiGatewayMethod.delete(contact_archive),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(contact_remove),
                    ),
                ),
            ),
            # Tags
            JupiterApiResource.build(
                "tags",
                JupiterApiGatewayMethod.get(tag_find),
                JupiterApiGatewayMethod.post(tag_create),
                JupiterApiResource.build(
                    "link",
                    JupiterApiGatewayMethod.post(tag_link_upsert),
                ),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(tag_load),
                    JupiterApiGatewayMethod.put(tag_update),
                    JupiterApiGatewayMethod.delete(tag_archive),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(tag_remove),
                    ),
                ),
            ),
            # Time Events
            JupiterApiResource.build(
                "time-events",
                JupiterApiResource.build(
                    "in-day-blocks",
                    JupiterApiResource.build(
                        "for-inbox-task",
                        JupiterApiGatewayMethod.post(
                            time_event_in_day_block_create_for_inbox_task,
                        ),
                    ),
                    JupiterApiResource.build(
                        "for-big-plan",
                        JupiterApiGatewayMethod.post(
                            time_event_in_day_block_create_for_big_plan,
                        ),
                    ),
                    JupiterApiResource.build(
                        ":ref_id",
                        JupiterApiGatewayMethod.get(time_event_in_day_block_load),
                        JupiterApiGatewayMethod.put(time_event_in_day_block_update),
                        JupiterApiGatewayMethod.delete(time_event_in_day_block_archive),
                        JupiterApiResource.build(
                            "remove",
                            JupiterApiGatewayMethod.delete(
                                time_event_in_day_block_remove
                            ),
                        ),
                    ),
                ),
                JupiterApiResource.build(
                    "full-days-blocks",
                    JupiterApiResource.build(
                        ":ref_id",
                        JupiterApiGatewayMethod.get(time_event_full_days_block_load),
                    ),
                ),
            ),
        ),
    )

    rich_print("=" * 80)
    rich_print("Starting Jupiter WebAPI:")
    rich_print(f"  Version: {global_properties.version}")
    rich_print(f"  Universe: {global_properties.universe}")
    rich_print(f"  Environment: {global_properties.env}")
    rich_print(f"  Instance: {global_properties.instance}")
    rich_print(f"  Hosting: {global_properties.universe.hosting}")
    rich_print("=" * 80)

    await api_service.run()


def sync_main() -> None:
    """Run the main function synchronously."""
    asyncio.run(main())


if __name__ == "__main__":
    sync_main()
