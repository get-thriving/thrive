"""Background reconciliation between domain crowns and the search index."""

import logging
from typing import assert_never

from jupiter.core.app import AppComponent
from jupiter.core.big_plans.collection import BigPlanCollection
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.chores.collection import ChoreCollection
from jupiter.core.chores.root import Chore
from jupiter.core.config import (
    JupiterBackgroundMutationUseCase,
    JupiterComponentProperties,
)
from jupiter.core.docs.collection import DocCollection
from jupiter.core.docs.root import Doc
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.habits.root import Habit
from jupiter.core.journals.collection import JournalCollection
from jupiter.core.journals.root import Journal
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.life_plan.sub.visions.root import Vision
from jupiter.core.metrics.collection import MetricCollection
from jupiter.core.metrics.root import Metric
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.prm.root import PRM
from jupiter.core.prm.sub.circle.root import Circle
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.push_integrations.group import PushIntegrationGroup
from jupiter.core.push_integrations.sub.email.task import EmailTask
from jupiter.core.push_integrations.sub.email.task_collection import EmailTaskCollection
from jupiter.core.push_integrations.sub.slack.task import SlackTask
from jupiter.core.push_integrations.sub.slack.task_collection import SlackTaskCollection
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.schedule.sub.event_full_days.root import ScheduleEventFullDays
from jupiter.core.schedule.sub.event_in_day.root import ScheduleEventInDay
from jupiter.core.schedule.sub.export.root import ScheduleExport
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.core.search.service.entity_index import SearchEntityIndexService
from jupiter.core.smart_lists.collection import SmartListCollection
from jupiter.core.smart_lists.root import SmartList
from jupiter.core.smart_lists.sub.item.root import SmartListItem
from jupiter.core.time_plans.domain import TimePlanDomain
from jupiter.core.time_plans.root import TimePlan
from jupiter.core.time_plans.sub.activity.root import TimePlanActivity
from jupiter.core.todo.domain import TodoDomain
from jupiter.core.todo.root import TodoTask
from jupiter.core.vacations.collection import VacationCollection
from jupiter.core.vacations.root import Vacation
from jupiter.core.workspaces.root import Workspace
from jupiter.core.metrics.sub.entry.root import MetricEntry
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity_indexing_summary import EntityIndexingSummary
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import EmptyContext
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args

LOGGER = logging.getLogger(__name__)


async def _load_workspace_summaries_for_entity_tag(
    uow: DomainUnitOfWork,
    workspace: Workspace,
    tag: NamedEntityTag,
) -> list[EntityIndexingSummary]:
    """Return summaries for crowns of ``tag`` in ``workspace`` (including archived)."""
    match tag:
        case (
            NamedEntityTag.OTHER
            | NamedEntityTag.SCORE_LOG_ENTRY
            | NamedEntityTag.HOME_TAB
            | NamedEntityTag.HOME_WIDGET
            | NamedEntityTag.WORKING_MEM
            | NamedEntityTag.SCHEDULE_EXTERNAL_SYNC_LOG
            | NamedEntityTag.BIG_PLAN_MILESTONE
            | NamedEntityTag.MILESTONE
            | NamedEntityTag.OCCASION
        ):
            return []
        case NamedEntityTag.TODO_TASK:
            todo_domain = await uow.get_for(TodoDomain).load_by_parent(workspace.ref_id)
            return await uow.get_for(TodoTask).find_summary(
                todo_domain.ref_id, allow_archived=True
            )
        case NamedEntityTag.TIME_PLAN:
            domain = await uow.get_for(TimePlanDomain).load_by_parent(workspace.ref_id)
            return await uow.get_for(TimePlan).find_summary(
                domain.ref_id, allow_archived=True
            )
        case NamedEntityTag.TIME_PLAN_ACTIVITY:
            domain = await uow.get_for(TimePlanDomain).load_by_parent(workspace.ref_id)
            plans = await uow.get_for(TimePlan).find_all(
                parent_ref_id=domain.ref_id,
                allow_archived=True,
            )
            summaries: list[EntityIndexingSummary] = []
            for plan in plans:
                summaries.extend(
                    await uow.get_for(TimePlanActivity).find_summary(
                        plan.ref_id, allow_archived=True
                    )
                )
            return summaries
        case (
            NamedEntityTag.SCHEDULE_STREAM
            | NamedEntityTag.SCHEDULE_EXPORT
            | NamedEntityTag.SCHEDULE_EVENT_IN_DAY
            | NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK
        ):
            schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
                workspace.ref_id
            )
            parent_id = schedule_domain.ref_id
            match tag:
                case NamedEntityTag.SCHEDULE_STREAM:
                    return await uow.get_for(ScheduleStream).find_summary(
                        parent_id, allow_archived=True
                    )
                case NamedEntityTag.SCHEDULE_EXPORT:
                    return await uow.get_for(ScheduleExport).find_summary(
                        parent_id, allow_archived=True
                    )
                case NamedEntityTag.SCHEDULE_EVENT_IN_DAY:
                    return await uow.get_for(ScheduleEventInDay).find_summary(
                        parent_id, allow_archived=True
                    )
                case NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK:
                    return await uow.get_for(ScheduleEventFullDays).find_summary(
                        parent_id, allow_archived=True
                    )
                case _ as schedule_rest:
                    assert_never(schedule_rest)
        case NamedEntityTag.HABIT:
            habit_collection = await uow.get_for(HabitCollection).load_by_parent(
                workspace.ref_id
            )
            return await uow.get_for(Habit).find_summary(
                habit_collection.ref_id, allow_archived=True
            )
        case NamedEntityTag.CHORE:
            chore_collection = await uow.get_for(ChoreCollection).load_by_parent(
                workspace.ref_id
            )
            return await uow.get_for(Chore).find_summary(
                chore_collection.ref_id, allow_archived=True
            )
        case NamedEntityTag.BIG_PLAN:
            big_plan_collection = await uow.get_for(BigPlanCollection).load_by_parent(
                workspace.ref_id
            )
            return await uow.get_for(BigPlan).find_summary(
                big_plan_collection.ref_id, allow_archived=True
            )
        case NamedEntityTag.JOURNAL:
            journal_collection = await uow.get_for(JournalCollection).load_by_parent(
                workspace.ref_id
            )
            return await uow.get_for(Journal).find_summary(
                journal_collection.ref_id, allow_archived=True
            )
        case NamedEntityTag.DOC:
            doc_collection = await uow.get_for(DocCollection).load_by_parent(
                workspace.ref_id
            )
            return await uow.get_for(Doc).find_summary(
                doc_collection.ref_id, allow_archived=True
            )
        case NamedEntityTag.VACATION:
            vacation_collection = await uow.get_for(VacationCollection).load_by_parent(
                workspace.ref_id
            )
            return await uow.get_for(Vacation).find_summary(
                vacation_collection.ref_id, allow_archived=True
            )
        case (
            NamedEntityTag.ASPECT
            | NamedEntityTag.CHAPTER
            | NamedEntityTag.GOAL
            | NamedEntityTag.VISION
        ):
            life_plan = await uow.get_for(LifePlan).load_by_parent(workspace.ref_id)
            parent_id = life_plan.ref_id
            match tag:
                case NamedEntityTag.ASPECT:
                    return await uow.get_for(Aspect).find_summary(
                        parent_id, allow_archived=True
                    )
                case NamedEntityTag.CHAPTER:
                    return await uow.get_for(Chapter).find_summary(
                        parent_id, allow_archived=True
                    )
                case NamedEntityTag.GOAL:
                    return await uow.get_for(Goal).find_summary(
                        parent_id, allow_archived=True
                    )
                case NamedEntityTag.VISION:
                    return await uow.get_for(Vision).find_summary(
                        parent_id, allow_archived=True
                    )
                case _ as life_plan_rest:
                    assert_never(life_plan_rest)
        case NamedEntityTag.SMART_LIST:
            smart_list_collection = await uow.get_for(
                SmartListCollection
            ).load_by_parent(workspace.ref_id)
            return await uow.get_for(SmartList).find_summary(
                smart_list_collection.ref_id, allow_archived=True
            )
        case NamedEntityTag.SMART_LIST_ITEM:
            smart_lists = await uow.get_for(SmartListCollection).load_by_parent(
                workspace.ref_id
            )
            lists = await uow.get_for(SmartList).find_all(
                parent_ref_id=smart_lists.ref_id,
                allow_archived=True,
            )
            item_summaries: list[EntityIndexingSummary] = []
            for sl in lists:
                item_summaries.extend(
                    await uow.get_for(SmartListItem).find_summary(
                        sl.ref_id, allow_archived=True
                    )
                )
            return item_summaries
        case NamedEntityTag.METRIC:
            metric_collection = await uow.get_for(MetricCollection).load_by_parent(
                workspace.ref_id
            )
            return await uow.get_for(Metric).find_summary(
                metric_collection.ref_id, allow_archived=True
            )
        case NamedEntityTag.METRIC_ENTRY:
            metric_entry_collection = await uow.get_for(
                MetricCollection
            ).load_by_parent(workspace.ref_id)
            metrics = await uow.get_for(Metric).find_all(
                parent_ref_id=metric_entry_collection.ref_id,
                allow_archived=True,
            )
            entry_summaries: list[EntityIndexingSummary] = []
            for m in metrics:
                entry_summaries.extend(
                    await uow.get_for(MetricEntry).find_summary(
                        m.ref_id, allow_archived=True
                    )
                )
            return entry_summaries
        case NamedEntityTag.PERSON:
            prm = await uow.get_for(PRM).load_by_parent(workspace.ref_id)
            return await uow.get_for(Person).find_summary(
                prm.ref_id, allow_archived=True
            )
        case NamedEntityTag.CIRCLE:
            prm = await uow.get_for(PRM).load_by_parent(workspace.ref_id)
            return await uow.get_for(Circle).find_summary(
                prm.ref_id, allow_archived=True
            )
        case NamedEntityTag.SLACK_TASK:
            slack_push_group = await uow.get_for(PushIntegrationGroup).load_by_parent(
                workspace.ref_id
            )
            slack_tasks = await uow.get_for(SlackTaskCollection).load_by_parent(
                slack_push_group.ref_id
            )
            return await uow.get_for(SlackTask).find_summary(
                slack_tasks.ref_id, allow_archived=True
            )
        case NamedEntityTag.EMAIL_TASK:
            email_push_group = await uow.get_for(PushIntegrationGroup).load_by_parent(
                workspace.ref_id
            )
            email_tasks = await uow.get_for(EmailTaskCollection).load_by_parent(
                email_push_group.ref_id
            )
            return await uow.get_for(EmailTask).find_summary(
                email_tasks.ref_id, allow_archived=True
            )
        case _ as unreachable:
            assert_never(unreachable)


@use_case_args
class SearchIndexBackfillDoAllArgs(UseCaseArgsBase):
    """Args for the search index backfill cron."""


class SearchIndexBackfillDoAllUseCase(
    JupiterBackgroundMutationUseCase[SearchIndexBackfillDoAllArgs, None]
):
    """Re-index changed entities and drop stale index rows."""

    async def _execute(
        self,
        context: EmptyContext,
        args: SearchIndexBackfillDoAllArgs,
    ) -> None:
        """Execute the command's action."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            workspaces = await uow.get_for(Workspace).find_all(allow_archived=False)

        _ = DomainContext.build_with_no_context_str(
            JupiterComponentProperties.for_cron(
                component=AppComponent.SEARCH_INDEX_BACKFILL,
                version=self._global_properties.version,
            ),
            TraceId.new(),
            self._time_provider.get_current_time(),
        )

        index_service = SearchEntityIndexService(
            self._ports, self._concept_registry, self._time_provider
        )

        LOGGER.info(
            "search_index_backfill starting workspace_count=%d",
            len(workspaces),
        )
        total_indexed = 0
        total_removed = 0

        for workspace in workspaces:
            LOGGER.info(
                "search_index_backfill workspace ref_id=%s name=%s",
                workspace.ref_id.as_int(),
                workspace.name,
            )
            for tag in NamedEntityTag:
                entity_type = tag.value
                async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                    summaries = await _load_workspace_summaries_for_entity_tag(
                        uow, workspace, tag
                    )
                async with (
                    self._ports.search_indexing_storage_engine.get_unit_of_work() as iuow
                ):
                    map_rows = await iuow.search_entity_indexing_map_repository.find_all_for_workspace_entity_type(
                        workspace.ref_id,
                        entity_type,
                    )
                by_id = {r.entity_ref_id: r for r in map_rows}
                summary_by_id = {s.ref_id: s for s in summaries}

                indexed_here = 0
                for s in summaries:
                    row = by_id.get(s.ref_id)
                    if row is None or s.last_modified_time > row.last_indexed_time:
                        object_id = await index_service.index(
                            workspace.ref_id,
                            entity_type,
                            s.ref_id,
                        )
                        LOGGER.info(
                            f"Indexing {tag}:{s.ref_id} => {object_id} time={s.last_modified_time.value}",
                        )

                        indexed_here += 1

                removed_here = 0
                for row in map_rows:
                    if row.entity_ref_id not in summary_by_id:
                        await index_service.remove(
                            workspace_ref_id=workspace.ref_id,
                            entity_type=row.entity_type,
                            entity_ref_id=row.entity_ref_id,
                        )
                        LOGGER.info(
                            f"Removing {row.entity_type}:{row.entity_ref_id} => {row.object_id} time={row.last_indexed_time.value}",
                        )
                        removed_here += 1

                total_indexed += indexed_here
                total_removed += removed_here
                if indexed_here > 0 or removed_here > 0:
                    LOGGER.info(
                        "search_index_backfill tag=%s ref_id=%s "
                        "summaries=%d map_rows=%d indexed=%d removed=%d",
                        entity_type,
                        workspace.ref_id.as_int(),
                        len(summaries),
                        len(map_rows),
                        indexed_here,
                        removed_here,
                    )

        LOGGER.info(
            "search_index_backfill finished indexed=%d removed=%d",
            total_indexed,
            total_removed,
        )
