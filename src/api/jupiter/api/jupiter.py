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
from jupiter_webapi_client.api.big_plans.big_plan_refresh_stats import (
    asyncio_detailed as big_plan_refresh_stats,
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
from jupiter_webapi_client.api.chores.chore_regen import (
    asyncio_detailed as chore_regen,
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
from jupiter_webapi_client.api.docs.doc_change_parent import (
    asyncio_detailed as doc_change_parent,
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
from jupiter_webapi_client.api.habits.habit_regen import (
    asyncio_detailed as habit_regen,
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
from jupiter_webapi_client.api.metrics.metric_regen import (
    asyncio_detailed as metric_regen,
)
from jupiter_webapi_client.api.metrics.metric_remove import (
    asyncio_detailed as metric_remove,
)
from jupiter_webapi_client.api.metrics.metric_update import (
    asyncio_detailed as metric_update,
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
from jupiter_webapi_client.api.prm.person_regen import (
    asyncio_detailed as person_regen,
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
from jupiter_webapi_client.api.schedule.schedule_external_sync_do import (
    asyncio_detailed as schedule_external_sync_do,
)
from jupiter_webapi_client.api.schedule.schedule_external_sync_load_runs import (
    asyncio_detailed as schedule_external_sync_load_runs,
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
from jupiter_webapi_client.api.time_plans.time_plan_gen_for_time_plan import (
    asyncio_detailed as time_plan_gen_for_time_plan,
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
from jupiter_webapi_client.api.time_plans.time_plan_regen import (
    asyncio_detailed as time_plan_regen,
)
from jupiter_webapi_client.api.time_plans.time_plan_remove import (
    asyncio_detailed as time_plan_remove,
)
from jupiter_webapi_client.api.time_plans.time_plan_update_settings import (
    asyncio_detailed as time_plan_update_settings,
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

# --- Model imports ---
from jupiter_webapi_client.models import (
    # Big Plans
    BigPlanArchiveArgs,
    BigPlanCreateArgs,
    BigPlanCreateResult,
    BigPlanFindArgs,
    BigPlanFindResult,
    BigPlanLoadArgs,
    BigPlanLoadResult,
    BigPlanMilestoneArchiveArgs,
    BigPlanMilestoneCreateArgs,
    BigPlanMilestoneCreateResult,
    BigPlanMilestoneLoadArgs,
    BigPlanMilestoneLoadResult,
    BigPlanMilestoneRemoveArgs,
    BigPlanMilestoneUpdateArgs,
    BigPlanRefreshStatsArgs,
    BigPlanRemoveArgs,
    BigPlanUpdateArgs,
    BigPlanUpdateResult,
    # Life Plan
    ChapterArchiveArgs,
    ChapterCreateArgs,
    ChapterCreateResult,
    ChapterFindArgs,
    ChapterFindResult,
    ChapterLoadArgs,
    ChapterLoadResult,
    ChapterRemoveArgs,
    ChapterUpdateArgs,
    # Chores
    ChoreArchiveArgs,
    ChoreCreateArgs,
    ChoreCreateResult,
    ChoreFindArgs,
    ChoreFindResult,
    ChoreLoadArgs,
    ChoreLoadResult,
    ChoreRegenArgs,
    ChoreRemoveArgs,
    ChoreSuspendArgs,
    ChoreUnsuspendArgs,
    ChoreUpdateArgs,
    # PRM
    CircleArchiveArgs,
    CircleCreateArgs,
    CircleCreateResult,
    CircleFindArgs,
    CircleFindResult,
    CircleLoadArgs,
    CircleLoadResult,
    CircleRemoveArgs,
    CircleUpdateArgs,
    # Docs
    DocArchiveArgs,
    DocChangeParentArgs,
    DocCreateArgs,
    DocCreateResult,
    DocFindArgs,
    DocFindResult,
    DocLoadArgs,
    DocLoadResult,
    DocRemoveArgs,
    DocUpdateArgs,
    GoalArchiveArgs,
    GoalCreateArgs,
    GoalCreateResult,
    GoalFindArgs,
    GoalFindResult,
    GoalLoadArgs,
    GoalLoadResult,
    GoalRemoveArgs,
    GoalUpdateArgs,
    # Habits
    HabitArchiveArgs,
    HabitCreateArgs,
    HabitCreateResult,
    HabitFindArgs,
    HabitFindResult,
    HabitLoadArgs,
    HabitLoadResult,
    HabitRegenArgs,
    HabitRemoveArgs,
    HabitSuspendArgs,
    HabitUnsuspendArgs,
    HabitUpdateArgs,
    # Inbox Tasks
    InboxTaskArchiveArgs,
    InboxTaskCreateArgs,
    InboxTaskCreateResult,
    InboxTaskFindArgs,
    InboxTaskFindResult,
    InboxTaskLoadArgs,
    InboxTaskLoadResult,
    InboxTaskRemoveArgs,
    InboxTaskUpdateArgs,
    InboxTaskUpdateResult,
    LifePlanUpdateArgs,
    # Metrics
    MetricArchiveArgs,
    MetricChangeCollectionProjectArgs,
    MetricCreateArgs,
    MetricCreateResult,
    MetricEntryArchiveArgs,
    MetricEntryCreateArgs,
    MetricEntryCreateResult,
    MetricEntryLoadArgs,
    MetricEntryLoadResult,
    MetricEntryRemoveArgs,
    MetricEntryUpdateArgs,
    MetricFindArgs,
    MetricFindResult,
    MetricLoadArgs,
    MetricLoadResult,
    MetricLoadSettingsArgs,
    MetricLoadSettingsResult,
    MetricRegenArgs,
    MetricRemoveArgs,
    MetricUpdateArgs,
    MilestoneArchiveArgs,
    MilestoneCreateArgs,
    MilestoneCreateResult,
    MilestoneFindArgs,
    MilestoneFindResult,
    MilestoneLoadArgs,
    MilestoneLoadResult,
    MilestoneRemoveArgs,
    MilestoneUpdateArgs,
    OccasionArchiveArgs,
    OccasionCreateArgs,
    OccasionCreateResult,
    OccasionLoadArgs,
    OccasionLoadResult,
    OccasionRemoveArgs,
    OccasionUpdateArgs,
    PersonArchiveArgs,
    PersonChangeCatchUpProjectArgs,
    PersonCreateArgs,
    PersonCreateResult,
    PersonFindArgs,
    PersonFindResult,
    PersonLoadArgs,
    PersonLoadResult,
    PersonLoadSettingsArgs,
    PersonLoadSettingsResult,
    PersonRegenArgs,
    PersonRemoveArgs,
    PersonUpdateArgs,
    ProjectArchiveArgs,
    ProjectCreateArgs,
    ProjectCreateResult,
    ProjectFindArgs,
    ProjectFindResult,
    ProjectLoadArgs,
    ProjectLoadResult,
    ProjectRemoveArgs,
    ProjectReorderChildrenArgs,
    ProjectUpdateArgs,
    ScheduleEventFullDaysArchiveArgs,
    ScheduleEventFullDaysChangeScheduleStreamArgs,
    ScheduleEventFullDaysCreateArgs,
    ScheduleEventFullDaysCreateResult,
    ScheduleEventFullDaysLoadArgs,
    ScheduleEventFullDaysLoadResult,
    ScheduleEventFullDaysRemoveArgs,
    ScheduleEventFullDaysUpdateArgs,
    ScheduleEventInDayArchiveArgs,
    ScheduleEventInDayChangeScheduleStreamArgs,
    ScheduleEventInDayCreateArgs,
    ScheduleEventInDayCreateResult,
    ScheduleEventInDayLoadArgs,
    ScheduleEventInDayLoadResult,
    ScheduleEventInDayRemoveArgs,
    ScheduleEventInDayUpdateArgs,
    ScheduleExternalSyncDoArgs,
    ScheduleExternalSyncLoadRunsArgs,
    ScheduleExternalSyncLoadRunsResult,
    # Schedule
    ScheduleStreamArchiveArgs,
    ScheduleStreamCreateForExternalIcalArgs,
    ScheduleStreamCreateForExternalIcalResult,
    ScheduleStreamCreateForUserArgs,
    ScheduleStreamCreateForUserResult,
    ScheduleStreamFindArgs,
    ScheduleStreamFindResult,
    ScheduleStreamLoadArgs,
    ScheduleStreamLoadResult,
    ScheduleStreamRemoveArgs,
    ScheduleStreamUpdateArgs,
    # Smart Lists
    SmartListArchiveArgs,
    SmartListCreateArgs,
    SmartListCreateResult,
    SmartListFindArgs,
    SmartListFindResult,
    SmartListItemCreateArgs,
    SmartListItemCreateResult,
    SmartListItemLoadArgs,
    SmartListItemLoadResult,
    SmartListItemRemoveArgs,
    SmartListItemUpdateArgs,
    SmartListLoadArgs,
    SmartListLoadResult,
    SmartListUpdateArgs,
    TimePlanActivityArchiveArgs,
    TimePlanActivityFindForTargetArgs,
    TimePlanActivityFindForTargetResult,
    TimePlanActivityLoadArgs,
    TimePlanActivityLoadResult,
    TimePlanActivityRemoveArgs,
    TimePlanActivityUpdateArgs,
    # Time Plans
    TimePlanArchiveArgs,
    TimePlanAssociateBigPlanWithPlanArgs,
    TimePlanAssociateBigPlanWithPlanResult,
    TimePlanAssociateInboxTaskWithPlanArgs,
    TimePlanAssociateInboxTaskWithPlanResult,
    TimePlanAssociateWithActivitiesArgs,
    TimePlanAssociateWithActivitiesResult,
    TimePlanAssociateWithBigPlansArgs,
    TimePlanAssociateWithBigPlansResult,
    TimePlanAssociateWithInboxTasksArgs,
    TimePlanAssociateWithInboxTasksResult,
    TimePlanChangeTimeConfigArgs,
    TimePlanCreateArgs,
    TimePlanCreateResult,
    TimePlanFindArgs,
    TimePlanFindResult,
    TimePlanGenForTimePlanArgs,
    TimePlanLoadArgs,
    TimePlanLoadForDateAndPeriodArgs,
    TimePlanLoadForDateAndPeriodResult,
    TimePlanLoadResult,
    TimePlanLoadSettingsArgs,
    TimePlanLoadSettingsResult,
    TimePlanRegenArgs,
    TimePlanRemoveArgs,
    TimePlanUpdateSettingsArgs,
    VisionArchiveArgs,
    VisionCreateDraftArgs,
    VisionCreateDraftResult,
    VisionFindArgs,
    VisionFindResult,
    VisionLoadActiveArgs,
    VisionLoadActiveResult,
    VisionLoadArgs,
    VisionLoadResult,
    VisionMarkDraftAsActiveArgs,
    VisionRemoveArgs,
    # Working Mem
    WorkingMemLoadCurrentArgs,
    WorkingMemLoadCurrentResult,
    WorkingMemLoadSettingsArgs,
    WorkingMemLoadSettingsResult,
    WorkingMemUpdateSettingsArgs,
)
from rich import print as rich_print


async def main() -> None:
    """Application main function."""
    global_properties = build_global_properties()
    service_properties = build_api_properties()

    telemetry: Telemetry

    if (
        global_properties.env.is_live
        and global_properties.universe.hosting.is_hosted_global
    ):
        telemetry = SentryTelemetry(service_properties.sentry_dsn)
    else:
        telemetry = LocalTelemetry()

    telemetry.prepare()

    webapi_client = WebApiClient(service_properties.webapi_url)

    ports = JupiterApiPorts(
        webapi_client=webapi_client,
    )

    api_service = JupiterApiService.build(
        ports,
        global_properties,
        service_properties,
        # Inbox Tasks
        JupiterApiResource.build(
            "inbox-tasks",
            JupiterApiGatewayMethod.get(
                InboxTaskFindArgs, InboxTaskFindResult, inbox_task_find
            ),
            JupiterApiGatewayMethod.post(
                InboxTaskCreateArgs, InboxTaskCreateResult, inbox_task_create
            ),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(
                    InboxTaskLoadArgs, InboxTaskLoadResult, inbox_task_load
                ),
                JupiterApiGatewayMethod.put(
                    InboxTaskUpdateArgs, InboxTaskUpdateResult, inbox_task_update
                ),
                JupiterApiGatewayMethod.delete(
                    InboxTaskArchiveArgs, None, inbox_task_archive
                ),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(
                        InboxTaskRemoveArgs, None, inbox_task_remove
                    ),
                ),
            ),
        ),
        # Working Mem
        JupiterApiResource.build(
            "working-mem",
            JupiterApiGatewayMethod.get(
                WorkingMemLoadCurrentArgs,
                WorkingMemLoadCurrentResult,
                working_mem_load_current,
            ),
            JupiterApiResource.build(
                "settings",
                JupiterApiGatewayMethod.get(
                    WorkingMemLoadSettingsArgs,
                    WorkingMemLoadSettingsResult,
                    working_mem_load_settings,
                ),
                JupiterApiGatewayMethod.put(
                    WorkingMemUpdateSettingsArgs, None, working_mem_update_settings
                ),
            ),
        ),
        # Time Plans
        JupiterApiResource.build(
            "time-plans",
            JupiterApiGatewayMethod.get(
                TimePlanFindArgs, TimePlanFindResult, time_plan_find
            ),
            JupiterApiGatewayMethod.post(
                TimePlanCreateArgs, TimePlanCreateResult, time_plan_create
            ),
            JupiterApiResource.build(
                "settings",
                JupiterApiGatewayMethod.get(
                    TimePlanLoadSettingsArgs,
                    TimePlanLoadSettingsResult,
                    time_plan_load_settings,
                ),
                JupiterApiGatewayMethod.put(
                    TimePlanUpdateSettingsArgs, None, time_plan_update_settings
                ),
            ),
            JupiterApiResource.build(
                "for-date-and-period",
                JupiterApiGatewayMethod.get(
                    TimePlanLoadForDateAndPeriodArgs,
                    TimePlanLoadForDateAndPeriodResult,
                    time_plan_load_for_date_and_period,
                ),
            ),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(
                    TimePlanLoadArgs, TimePlanLoadResult, time_plan_load
                ),
                JupiterApiGatewayMethod.delete(
                    TimePlanArchiveArgs, None, time_plan_archive
                ),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(
                        TimePlanRemoveArgs, None, time_plan_remove
                    ),
                ),
                JupiterApiResource.build(
                    "change-time-config",
                    JupiterApiGatewayMethod.post(
                        TimePlanChangeTimeConfigArgs, None, time_plan_change_time_config
                    ),
                ),
                JupiterApiResource.build(
                    "associate-big-plan",
                    JupiterApiGatewayMethod.post(
                        TimePlanAssociateBigPlanWithPlanArgs,
                        TimePlanAssociateBigPlanWithPlanResult,
                        time_plan_associate_big_plan_with_plan,
                    ),
                ),
                JupiterApiResource.build(
                    "associate-inbox-task",
                    JupiterApiGatewayMethod.post(
                        TimePlanAssociateInboxTaskWithPlanArgs,
                        TimePlanAssociateInboxTaskWithPlanResult,
                        time_plan_associate_inbox_task_with_plan,
                    ),
                ),
                JupiterApiResource.build(
                    "associate-with-activities",
                    JupiterApiGatewayMethod.post(
                        TimePlanAssociateWithActivitiesArgs,
                        TimePlanAssociateWithActivitiesResult,
                        time_plan_associate_with_activities,
                    ),
                ),
                JupiterApiResource.build(
                    "associate-with-big-plans",
                    JupiterApiGatewayMethod.post(
                        TimePlanAssociateWithBigPlansArgs,
                        TimePlanAssociateWithBigPlansResult,
                        time_plan_associate_with_big_plans,
                    ),
                ),
                JupiterApiResource.build(
                    "associate-with-inbox-tasks",
                    JupiterApiGatewayMethod.post(
                        TimePlanAssociateWithInboxTasksArgs,
                        TimePlanAssociateWithInboxTasksResult,
                        time_plan_associate_with_inbox_tasks,
                    ),
                ),
                JupiterApiResource.build(
                    "gen",
                    JupiterApiGatewayMethod.post(
                        TimePlanGenForTimePlanArgs, None, time_plan_gen_for_time_plan
                    ),
                ),
                JupiterApiResource.build(
                    "regen",
                    JupiterApiGatewayMethod.post(
                        TimePlanRegenArgs, None, time_plan_regen
                    ),
                ),
                JupiterApiResource.build(
                    "activities",
                    JupiterApiResource.build(
                        "find-for-target",
                        JupiterApiGatewayMethod.get(
                            TimePlanActivityFindForTargetArgs,
                            TimePlanActivityFindForTargetResult,
                            time_plan_activity_find_for_target,
                        ),
                    ),
                    JupiterApiResource.build(
                        ":activities:ref_id",
                        JupiterApiGatewayMethod.get(
                            TimePlanActivityLoadArgs,
                            TimePlanActivityLoadResult,
                            time_plan_activity_load,
                        ),
                        JupiterApiGatewayMethod.put(
                            TimePlanActivityUpdateArgs,
                            None,
                            time_plan_activity_update,
                        ),
                        JupiterApiGatewayMethod.delete(
                            TimePlanActivityArchiveArgs,
                            None,
                            time_plan_activity_archive,
                        ),
                        JupiterApiResource.build(
                            "remove",
                            JupiterApiGatewayMethod.delete(
                                TimePlanActivityRemoveArgs,
                                None,
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
                JupiterApiGatewayMethod.get(
                    ScheduleStreamFindArgs,
                    ScheduleStreamFindResult,
                    schedule_stream_find,
                ),
                JupiterApiResource.build(
                    "for-user",
                    JupiterApiGatewayMethod.post(
                        ScheduleStreamCreateForUserArgs,
                        ScheduleStreamCreateForUserResult,
                        schedule_stream_create_for_user,
                    ),
                ),
                JupiterApiResource.build(
                    "for-external-ical",
                    JupiterApiGatewayMethod.post(
                        ScheduleStreamCreateForExternalIcalArgs,
                        ScheduleStreamCreateForExternalIcalResult,
                        schedule_stream_create_for_external_ical,
                    ),
                ),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(
                        ScheduleStreamLoadArgs,
                        ScheduleStreamLoadResult,
                        schedule_stream_load,
                    ),
                    JupiterApiGatewayMethod.put(
                        ScheduleStreamUpdateArgs, None, schedule_stream_update
                    ),
                    JupiterApiGatewayMethod.delete(
                        ScheduleStreamArchiveArgs, None, schedule_stream_archive
                    ),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(
                            ScheduleStreamRemoveArgs, None, schedule_stream_remove
                        ),
                    ),
                ),
            ),
            JupiterApiResource.build(
                "events-full-days",
                JupiterApiGatewayMethod.post(
                    ScheduleEventFullDaysCreateArgs,
                    ScheduleEventFullDaysCreateResult,
                    schedule_event_full_days_create,
                ),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(
                        ScheduleEventFullDaysLoadArgs,
                        ScheduleEventFullDaysLoadResult,
                        schedule_event_full_days_load,
                    ),
                    JupiterApiGatewayMethod.put(
                        ScheduleEventFullDaysUpdateArgs,
                        None,
                        schedule_event_full_days_update,
                    ),
                    JupiterApiGatewayMethod.delete(
                        ScheduleEventFullDaysArchiveArgs,
                        None,
                        schedule_event_full_days_archive,
                    ),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(
                            ScheduleEventFullDaysRemoveArgs,
                            None,
                            schedule_event_full_days_remove,
                        ),
                    ),
                    JupiterApiResource.build(
                        "change-stream",
                        JupiterApiGatewayMethod.post(
                            ScheduleEventFullDaysChangeScheduleStreamArgs,
                            None,
                            schedule_event_full_days_change_schedule_stream,
                        ),
                    ),
                ),
            ),
            JupiterApiResource.build(
                "events-in-day",
                JupiterApiGatewayMethod.post(
                    ScheduleEventInDayCreateArgs,
                    ScheduleEventInDayCreateResult,
                    schedule_event_in_day_create,
                ),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(
                        ScheduleEventInDayLoadArgs,
                        ScheduleEventInDayLoadResult,
                        schedule_event_in_day_load,
                    ),
                    JupiterApiGatewayMethod.put(
                        ScheduleEventInDayUpdateArgs,
                        None,
                        schedule_event_in_day_update,
                    ),
                    JupiterApiGatewayMethod.delete(
                        ScheduleEventInDayArchiveArgs,
                        None,
                        schedule_event_in_day_archive,
                    ),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(
                            ScheduleEventInDayRemoveArgs,
                            None,
                            schedule_event_in_day_remove,
                        ),
                    ),
                    JupiterApiResource.build(
                        "change-stream",
                        JupiterApiGatewayMethod.post(
                            ScheduleEventInDayChangeScheduleStreamArgs,
                            None,
                            schedule_event_in_day_change_schedule_stream,
                        ),
                    ),
                ),
            ),
            JupiterApiResource.build(
                "external-sync",
                JupiterApiResource.build(
                    "do",
                    JupiterApiGatewayMethod.post(
                        ScheduleExternalSyncDoArgs, None, schedule_external_sync_do
                    ),
                ),
                JupiterApiResource.build(
                    "load-runs",
                    JupiterApiGatewayMethod.get(
                        ScheduleExternalSyncLoadRunsArgs,
                        ScheduleExternalSyncLoadRunsResult,
                        schedule_external_sync_load_runs,
                    ),
                ),
            ),
        ),
        # Habits
        JupiterApiResource.build(
            "habits",
            JupiterApiGatewayMethod.get(HabitFindArgs, HabitFindResult, habit_find),
            JupiterApiGatewayMethod.post(
                HabitCreateArgs, HabitCreateResult, habit_create
            ),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(HabitLoadArgs, HabitLoadResult, habit_load),
                JupiterApiGatewayMethod.put(HabitUpdateArgs, None, habit_update),
                JupiterApiGatewayMethod.delete(HabitArchiveArgs, None, habit_archive),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(HabitRemoveArgs, None, habit_remove),
                ),
                JupiterApiResource.build(
                    "suspend",
                    JupiterApiGatewayMethod.post(HabitSuspendArgs, None, habit_suspend),
                ),
                JupiterApiResource.build(
                    "unsuspend",
                    JupiterApiGatewayMethod.post(
                        HabitUnsuspendArgs, None, habit_unsuspend
                    ),
                ),
                JupiterApiResource.build(
                    "regen",
                    JupiterApiGatewayMethod.post(HabitRegenArgs, None, habit_regen),
                ),
            ),
        ),
        # Chores
        JupiterApiResource.build(
            "chores",
            JupiterApiGatewayMethod.get(ChoreFindArgs, ChoreFindResult, chore_find),
            JupiterApiGatewayMethod.post(
                ChoreCreateArgs, ChoreCreateResult, chore_create
            ),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(ChoreLoadArgs, ChoreLoadResult, chore_load),
                JupiterApiGatewayMethod.put(ChoreUpdateArgs, None, chore_update),
                JupiterApiGatewayMethod.delete(ChoreArchiveArgs, None, chore_archive),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(ChoreRemoveArgs, None, chore_remove),
                ),
                JupiterApiResource.build(
                    "suspend",
                    JupiterApiGatewayMethod.post(ChoreSuspendArgs, None, chore_suspend),
                ),
                JupiterApiResource.build(
                    "unsuspend",
                    JupiterApiGatewayMethod.post(
                        ChoreUnsuspendArgs, None, chore_unsuspend
                    ),
                ),
                JupiterApiResource.build(
                    "regen",
                    JupiterApiGatewayMethod.post(ChoreRegenArgs, None, chore_regen),
                ),
            ),
        ),
        # Big Plans
        JupiterApiResource.build(
            "big-plans",
            JupiterApiGatewayMethod.get(
                BigPlanFindArgs, BigPlanFindResult, big_plan_find
            ),
            JupiterApiGatewayMethod.post(
                BigPlanCreateArgs, BigPlanCreateResult, big_plan_create
            ),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(
                    BigPlanLoadArgs, BigPlanLoadResult, big_plan_load
                ),
                JupiterApiGatewayMethod.put(
                    BigPlanUpdateArgs, BigPlanUpdateResult, big_plan_update
                ),
                JupiterApiGatewayMethod.delete(
                    BigPlanArchiveArgs, None, big_plan_archive
                ),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(
                        BigPlanRemoveArgs, None, big_plan_remove
                    ),
                ),
                JupiterApiResource.build(
                    "refresh-stats",
                    JupiterApiGatewayMethod.post(
                        BigPlanRefreshStatsArgs, None, big_plan_refresh_stats
                    ),
                ),
                JupiterApiResource.build(
                    "milestones",
                    JupiterApiGatewayMethod.post(
                        BigPlanMilestoneCreateArgs,
                        BigPlanMilestoneCreateResult,
                        big_plan_milestone_create,
                    ),
                    JupiterApiResource.build(
                        ":milestones:ref_id",
                        JupiterApiGatewayMethod.get(
                            BigPlanMilestoneLoadArgs,
                            BigPlanMilestoneLoadResult,
                            big_plan_milestone_load,
                        ),
                        JupiterApiGatewayMethod.put(
                            BigPlanMilestoneUpdateArgs,
                            None,
                            big_plan_milestone_update,
                        ),
                        JupiterApiGatewayMethod.delete(
                            BigPlanMilestoneArchiveArgs,
                            None,
                            big_plan_milestone_archive,
                        ),
                        JupiterApiResource.build(
                            "remove",
                            JupiterApiGatewayMethod.delete(
                                BigPlanMilestoneRemoveArgs,
                                None,
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
            JupiterApiGatewayMethod.get(DocFindArgs, DocFindResult, doc_find),
            JupiterApiGatewayMethod.post(DocCreateArgs, DocCreateResult, doc_create),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(DocLoadArgs, DocLoadResult, doc_load),
                JupiterApiGatewayMethod.put(DocUpdateArgs, None, doc_update),
                JupiterApiGatewayMethod.delete(DocArchiveArgs, None, doc_archive),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(DocRemoveArgs, None, doc_remove),
                ),
                JupiterApiResource.build(
                    "change-parent",
                    JupiterApiGatewayMethod.post(
                        DocChangeParentArgs, None, doc_change_parent
                    ),
                ),
            ),
        ),
        # Life Plan
        JupiterApiResource.build(
            "life-plan",
            JupiterApiGatewayMethod.put(LifePlanUpdateArgs, None, life_plan_update),
            JupiterApiResource.build(
                "visions",
                JupiterApiGatewayMethod.get(
                    VisionFindArgs, VisionFindResult, vision_find
                ),
                JupiterApiResource.build(
                    "create-draft",
                    JupiterApiGatewayMethod.post(
                        VisionCreateDraftArgs,
                        VisionCreateDraftResult,
                        vision_create_draft,
                    ),
                ),
                JupiterApiResource.build(
                    "active",
                    JupiterApiGatewayMethod.get(
                        VisionLoadActiveArgs,
                        VisionLoadActiveResult,
                        vision_load_active,
                    ),
                ),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(
                        VisionLoadArgs, VisionLoadResult, vision_load
                    ),
                    JupiterApiGatewayMethod.delete(
                        VisionArchiveArgs, None, vision_archive
                    ),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(
                            VisionRemoveArgs, None, vision_remove
                        ),
                    ),
                    JupiterApiResource.build(
                        "mark-active",
                        JupiterApiGatewayMethod.post(
                            VisionMarkDraftAsActiveArgs,
                            None,
                            vision_mark_draft_as_active,
                        ),
                    ),
                ),
            ),
            JupiterApiResource.build(
                "chapters",
                JupiterApiGatewayMethod.get(
                    ChapterFindArgs, ChapterFindResult, chapter_find
                ),
                JupiterApiGatewayMethod.post(
                    ChapterCreateArgs, ChapterCreateResult, chapter_create
                ),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(
                        ChapterLoadArgs, ChapterLoadResult, chapter_load
                    ),
                    JupiterApiGatewayMethod.put(
                        ChapterUpdateArgs, None, chapter_update
                    ),
                    JupiterApiGatewayMethod.delete(
                        ChapterArchiveArgs, None, chapter_archive
                    ),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(
                            ChapterRemoveArgs, None, chapter_remove
                        ),
                    ),
                ),
            ),
            JupiterApiResource.build(
                "goals",
                JupiterApiGatewayMethod.get(GoalFindArgs, GoalFindResult, goal_find),
                JupiterApiGatewayMethod.post(
                    GoalCreateArgs, GoalCreateResult, goal_create
                ),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(
                        GoalLoadArgs, GoalLoadResult, goal_load
                    ),
                    JupiterApiGatewayMethod.put(GoalUpdateArgs, None, goal_update),
                    JupiterApiGatewayMethod.delete(GoalArchiveArgs, None, goal_archive),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(
                            GoalRemoveArgs, None, goal_remove
                        ),
                    ),
                ),
            ),
            JupiterApiResource.build(
                "milestones",
                JupiterApiGatewayMethod.get(
                    MilestoneFindArgs, MilestoneFindResult, milestone_find
                ),
                JupiterApiGatewayMethod.post(
                    MilestoneCreateArgs, MilestoneCreateResult, milestone_create
                ),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(
                        MilestoneLoadArgs, MilestoneLoadResult, milestone_load
                    ),
                    JupiterApiGatewayMethod.put(
                        MilestoneUpdateArgs, None, milestone_update
                    ),
                    JupiterApiGatewayMethod.delete(
                        MilestoneArchiveArgs, None, milestone_archive
                    ),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(
                            MilestoneRemoveArgs, None, milestone_remove
                        ),
                    ),
                ),
            ),
            JupiterApiResource.build(
                "projects",
                JupiterApiGatewayMethod.get(
                    ProjectFindArgs, ProjectFindResult, project_find
                ),
                JupiterApiGatewayMethod.post(
                    ProjectCreateArgs, ProjectCreateResult, project_create
                ),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(
                        ProjectLoadArgs, ProjectLoadResult, project_load
                    ),
                    JupiterApiGatewayMethod.put(
                        ProjectUpdateArgs, None, project_update
                    ),
                    JupiterApiGatewayMethod.delete(
                        ProjectArchiveArgs, None, project_archive
                    ),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(
                            ProjectRemoveArgs, None, project_remove
                        ),
                    ),
                    JupiterApiResource.build(
                        "reorder-children",
                        JupiterApiGatewayMethod.post(
                            ProjectReorderChildrenArgs, None, project_reorder_children
                        ),
                    ),
                ),
            ),
        ),
        # Metrics
        JupiterApiResource.build(
            "metrics",
            JupiterApiGatewayMethod.get(MetricFindArgs, MetricFindResult, metric_find),
            JupiterApiGatewayMethod.post(
                MetricCreateArgs, MetricCreateResult, metric_create
            ),
            JupiterApiResource.build(
                "settings",
                JupiterApiGatewayMethod.get(
                    MetricLoadSettingsArgs,
                    MetricLoadSettingsResult,
                    metric_load_settings,
                ),
            ),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(
                    MetricLoadArgs, MetricLoadResult, metric_load
                ),
                JupiterApiGatewayMethod.put(MetricUpdateArgs, None, metric_update),
                JupiterApiGatewayMethod.delete(MetricArchiveArgs, None, metric_archive),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(
                        MetricRemoveArgs, None, metric_remove
                    ),
                ),
                JupiterApiResource.build(
                    "regen",
                    JupiterApiGatewayMethod.post(MetricRegenArgs, None, metric_regen),
                ),
                JupiterApiResource.build(
                    "change-collection-project",
                    JupiterApiGatewayMethod.post(
                        MetricChangeCollectionProjectArgs,
                        None,
                        metric_change_collection_project,
                    ),
                ),
                JupiterApiResource.build(
                    "entries",
                    JupiterApiGatewayMethod.post(
                        MetricEntryCreateArgs,
                        MetricEntryCreateResult,
                        metric_entry_create,
                    ),
                    JupiterApiResource.build(
                        ":entries:ref_id",
                        JupiterApiGatewayMethod.get(
                            MetricEntryLoadArgs,
                            MetricEntryLoadResult,
                            metric_entry_load,
                        ),
                        JupiterApiGatewayMethod.put(
                            MetricEntryUpdateArgs, None, metric_entry_update
                        ),
                        JupiterApiGatewayMethod.delete(
                            MetricEntryArchiveArgs, None, metric_entry_archive
                        ),
                        JupiterApiResource.build(
                            "remove",
                            JupiterApiGatewayMethod.delete(
                                MetricEntryRemoveArgs, None, metric_entry_remove
                            ),
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
                JupiterApiGatewayMethod.get(
                    PersonLoadSettingsArgs,
                    PersonLoadSettingsResult,
                    person_load_settings,
                ),
            ),
            JupiterApiResource.build(
                "change-catch-up-project",
                JupiterApiGatewayMethod.post(
                    PersonChangeCatchUpProjectArgs,
                    None,
                    person_change_catch_up_project,
                ),
            ),
            JupiterApiResource.build(
                "persons",
                JupiterApiGatewayMethod.get(
                    PersonFindArgs, PersonFindResult, person_find
                ),
                JupiterApiGatewayMethod.post(
                    PersonCreateArgs, PersonCreateResult, person_create
                ),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(
                        PersonLoadArgs, PersonLoadResult, person_load
                    ),
                    JupiterApiGatewayMethod.put(PersonUpdateArgs, None, person_update),
                    JupiterApiGatewayMethod.delete(
                        PersonArchiveArgs, None, person_archive
                    ),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(
                            PersonRemoveArgs, None, person_remove
                        ),
                    ),
                    JupiterApiResource.build(
                        "regen",
                        JupiterApiGatewayMethod.post(
                            PersonRegenArgs, None, person_regen
                        ),
                    ),
                    JupiterApiResource.build(
                        "occasions",
                        JupiterApiGatewayMethod.post(
                            OccasionCreateArgs,
                            OccasionCreateResult,
                            occasion_create,
                        ),
                        JupiterApiResource.build(
                            ":occasions:ref_id",
                            JupiterApiGatewayMethod.get(
                                OccasionLoadArgs,
                                OccasionLoadResult,
                                occasion_load,
                            ),
                            JupiterApiGatewayMethod.put(
                                OccasionUpdateArgs, None, occasion_update
                            ),
                            JupiterApiGatewayMethod.delete(
                                OccasionArchiveArgs, None, occasion_archive
                            ),
                            JupiterApiResource.build(
                                "remove",
                                JupiterApiGatewayMethod.delete(
                                    OccasionRemoveArgs, None, occasion_remove
                                ),
                            ),
                        ),
                    ),
                ),
            ),
            JupiterApiResource.build(
                "circles",
                JupiterApiGatewayMethod.get(
                    CircleFindArgs, CircleFindResult, circle_find
                ),
                JupiterApiGatewayMethod.post(
                    CircleCreateArgs, CircleCreateResult, circle_create
                ),
                JupiterApiResource.build(
                    ":ref_id",
                    JupiterApiGatewayMethod.get(
                        CircleLoadArgs, CircleLoadResult, circle_load
                    ),
                    JupiterApiGatewayMethod.put(CircleUpdateArgs, None, circle_update),
                    JupiterApiGatewayMethod.delete(
                        CircleArchiveArgs, None, circle_archive
                    ),
                    JupiterApiResource.build(
                        "remove",
                        JupiterApiGatewayMethod.delete(
                            CircleRemoveArgs, None, circle_remove
                        ),
                    ),
                ),
            ),
        ),
        # Smart Lists
        JupiterApiResource.build(
            "smart-lists",
            JupiterApiGatewayMethod.post(
                SmartListCreateArgs, SmartListCreateResult, smart_list_create
            ),
            JupiterApiGatewayMethod.get(
                SmartListFindArgs, SmartListFindResult, smart_list_find
            ),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(
                    SmartListLoadArgs, SmartListLoadResult, smart_list_load
                ),
                JupiterApiGatewayMethod.put(
                    SmartListUpdateArgs, None, smart_list_update
                ),
                JupiterApiGatewayMethod.delete(
                    SmartListArchiveArgs, None, smart_list_archive
                ),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(
                        SmartListItemRemoveArgs, None, smart_list_remove
                    ),
                ),
                JupiterApiResource.build(
                    "items",
                    JupiterApiGatewayMethod.post(
                        SmartListItemCreateArgs,
                        SmartListItemCreateResult,
                        smart_list_item_create,
                    ),
                    JupiterApiResource.build(
                        ":items:ref_id",
                        JupiterApiGatewayMethod.get(
                            SmartListItemLoadArgs,
                            SmartListItemLoadResult,
                            smart_list_item_load,
                        ),
                        JupiterApiGatewayMethod.put(
                            SmartListItemUpdateArgs, None, smart_list_item_update
                        ),
                        JupiterApiGatewayMethod.delete(
                            SmartListItemRemoveArgs, None, smart_list_item_remove
                        ),
                        JupiterApiResource.build(
                            "remove",
                            JupiterApiGatewayMethod.delete(
                                SmartListItemRemoveArgs, None, smart_list_item_remove
                            ),
                        ),
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
