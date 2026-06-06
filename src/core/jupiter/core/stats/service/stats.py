"""Compute stats for a workspace."""

from typing import Final

from jupiter.core.projects.collection import ProjectCollection
from jupiter.core.projects.root import Project, ProjectRepository
from jupiter.core.projects.stats import ProjectStats, ProjectStatsRepository
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.parent_link_namespace import (
    all_parent_link_namespaces_for_workspace_sources,
)
from jupiter.core.common.sub.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.features import UserFeature, WorkspaceFeature
from jupiter.core.gamification.service.record_score import (
    RecordScoreService,
)
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.habits.root import Habit
from jupiter.core.habits.service.streak_recorder import (
    HabitStreakRecorderService,
)
from jupiter.core.journals.collection import JournalCollection
from jupiter.core.journals.root import Journal, JournalRepository
from jupiter.core.journals.stats import (
    JournalStats,
    JournalStatsRepository,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.report.service.report import ReportService
from jupiter.core.stats.log import StatsLog
from jupiter.core.stats.log_entry import StatsLogEntry
from jupiter.core.sync_target import SyncTarget
from jupiter.core.users.root import User
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import NoFilter
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainStorageEngine


class StatsService:
    """Service for computing stats for a workspace."""

    _domain_storage_engine: Final[DomainStorageEngine]

    def __init__(self, domain_storage_engine: DomainStorageEngine) -> None:
        """Constructor."""
        self._domain_storage_engine = domain_storage_engine

    async def do_it(
        self,
        ctx: DomainContext,
        progress_reporter: ProgressReporter,
        user: User,
        workspace: Workspace,
        today: ADate,
        stats_targets: list[SyncTarget],
        filter_habit_ref_ids: list[EntityId] | None = None,
        filter_project_ref_ids: list[EntityId] | None = None,
        filter_journal_ref_ids: list[EntityId] | None = None,
    ) -> None:
        """Execute the service's action."""
        async with self._domain_storage_engine.get_unit_of_work() as uow:
            stats_log = await uow.get_for(StatsLog).load_by_parent(workspace.ref_id)
            stats_log_entry = StatsLogEntry.new_log_entry(
                ctx,
                stats_log_ref_id=stats_log.ref_id,
                stats_targets=stats_targets,
                today=today,
            )
            stats_log_entry = await uow.get_for(StatsLogEntry).create(stats_log_entry)

            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(workspace.ref_id)
            habit_collection = await uow.get_for(HabitCollection).load_by_parent(
                workspace.ref_id
            )
            project_collection = await uow.get_for(ProjectCollection).load_by_parent(
                workspace.ref_id
            )
            journal_collection = await uow.get_for(JournalCollection).load_by_parent(
                workspace.ref_id
            )

        if (
            workspace.is_feature_available(WorkspaceFeature.HABITS)
            and SyncTarget.HABITS in stats_targets
        ):
            async with progress_reporter.section("Computing stats for habits"):
                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    all_habits = await uow.get_for(Habit).find_all_generic(
                        parent_ref_id=habit_collection.ref_id,
                        allow_archived=False,
                        ref_id=(
                            filter_habit_ref_ids if filter_habit_ref_ids else NoFilter()
                        ),
                    )

                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    all_inbox_tasks = (
                        await uow.get_for(InboxTask).find_all_generic(
                            parent_ref_id=inbox_task_collection.ref_id,
                            allow_archived=True,
                            owner=[
                                EntityLink.std(NamedEntityTag.HABIT.value, habit.ref_id)
                                for habit in all_habits
                            ],
                        )
                        if all_habits
                        else []
                    )

                stats_log_entry = await self._compute_stats_for_habits(
                    ctx,
                    user=user,
                    workspace=workspace,
                    progress_reporter=progress_reporter,
                    all_habits=all_habits,
                    all_inbox_tasks=all_inbox_tasks,
                    stats_log_entry=stats_log_entry,
                )

        if (
            workspace.is_feature_available(WorkspaceFeature.PROJECTS)
            and SyncTarget.PROJECTS in stats_targets
        ):
            async with progress_reporter.section("Computing stats for projects"):
                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    all_projects = await uow.get_for(Project).find_all_generic(
                        parent_ref_id=project_collection.ref_id,
                        allow_archived=False,
                        ref_id=(
                            filter_project_ref_ids
                            if filter_project_ref_ids
                            else NoFilter()
                        ),
                    )

                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    all_inbox_tasks = (
                        await uow.get_for(InboxTask).find_all_generic(
                            parent_ref_id=inbox_task_collection.ref_id,
                            allow_archived=True,
                            owner=[
                                EntityLink.std(
                                    NamedEntityTag.PROJECT.value, project.ref_id
                                )
                                for project in all_projects
                            ],
                        )
                        if all_projects
                        else []
                    )

                stats_log_entry = await self._compute_stats_for_projects(
                    ctx,
                    user=user,
                    workspace=workspace,
                    progress_reporter=progress_reporter,
                    all_projects=all_projects,
                    all_inbox_tasks=all_inbox_tasks,
                    stats_log_entry=stats_log_entry,
                )

        if (
            workspace.is_feature_available(WorkspaceFeature.JOURNALS)
            and SyncTarget.JOURNALS in stats_targets
        ):
            async with progress_reporter.section("Computing stats for journals"):
                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    if filter_journal_ref_ids:
                        all_journals = await uow.get(
                            JournalRepository
                        ).find_all_generic(
                            parent_ref_id=journal_collection.ref_id,
                            allow_archived=False,
                            ref_id=filter_journal_ref_ids,
                        )
                    else:
                        all_journals = await uow.get(
                            JournalRepository
                        ).find_all_in_range(
                            parent_ref_id=journal_collection.ref_id,
                            allow_archived=False,
                            filter_periods=list(p for p in RecurringTaskPeriod),
                            filter_start_date=today.subtract_days(400),
                            filter_end_date=today.add_days(30),
                        )

                stats_log_entry = await self._compute_stats_for_journals(
                    ctx,
                    user=user,
                    workspace=workspace,
                    progress_reporter=progress_reporter,
                    all_journals=all_journals,
                    stats_log_entry=stats_log_entry,
                )

        if (
            user.is_feature_available(UserFeature.GAMIFICATION)
            and SyncTarget.GAMIFICATION in stats_targets
        ):
            async with progress_reporter.section("Computing stats for gamification"):
                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    all_inbox_tasks_last_year = await uow.get(
                        InboxTaskRepository
                    ).find_completed_in_range(
                        parent_ref_id=inbox_task_collection.ref_id,
                        allow_archived=True,
                        filter_include_parent_link_namespaces=all_parent_link_namespaces_for_workspace_sources(),
                        filter_start_completed_date=today.subtract_days(365),
                        filter_end_completed_date=today,
                    )

                    all_projects_last_year = await uow.get(
                        ProjectRepository
                    ).find_completed_in_range(
                        parent_ref_id=project_collection.ref_id,
                        allow_archived=True,
                        filter_start_completed_date=today.subtract_days(365),
                        filter_end_completed_date=today,
                    )

                stats_log_entry = await self._compute_stats_for_gamification(
                    ctx,
                    user=user,
                    workspace=workspace,
                    progress_reporter=progress_reporter,
                    all_inbox_tasks_last_year=all_inbox_tasks_last_year,
                    all_projects_last_year=all_projects_last_year,
                    stats_log_entry=stats_log_entry,
                )

        async with self._domain_storage_engine.get_unit_of_work() as uow:
            stats_log_entry = stats_log_entry.close(ctx)
            await uow.get_for(StatsLogEntry).save(stats_log_entry)

    async def _compute_stats_for_habits(
        self,
        ctx: DomainContext,
        user: User,
        workspace: Workspace,
        progress_reporter: ProgressReporter,
        all_habits: list[Habit],
        all_inbox_tasks: list[InboxTask],
        stats_log_entry: StatsLogEntry,
    ) -> StatsLogEntry:
        # Group inbox tasks by habit ref id
        inbox_tasks_by_habit_ref_id: dict[EntityId, list[InboxTask]] = {}
        for inbox_task in all_inbox_tasks:
            rid = inbox_task.owner.ref_id
            if rid not in inbox_tasks_by_habit_ref_id:
                inbox_tasks_by_habit_ref_id[rid] = []
            inbox_tasks_by_habit_ref_id[rid].append(inbox_task)

        # Compute stats for each habit
        streak_recorder_service = HabitStreakRecorderService()

        for habit in all_habits:
            habit_inbox_tasks = inbox_tasks_by_habit_ref_id.get(habit.ref_id, [])

            for inbox_task in habit_inbox_tasks:
                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    await streak_recorder_service.update_with_status(
                        ctx=ctx,
                        uow=uow,
                        habit=habit,
                        inbox_task=inbox_task,
                    )

            await progress_reporter.mark_updated(habit)
            stats_log_entry = stats_log_entry.add_entity_updated(ctx, habit)

        return stats_log_entry

    async def _compute_stats_for_projects(
        self,
        ctx: DomainContext,
        user: User,
        workspace: Workspace,
        progress_reporter: ProgressReporter,
        all_projects: list[Project],
        all_inbox_tasks: list[InboxTask],
        stats_log_entry: StatsLogEntry,
    ) -> StatsLogEntry:
        # Group inbox tasks by project ref id
        inbox_tasks_by_project_ref_id: dict[EntityId, list[InboxTask]] = {}
        for inbox_task in all_inbox_tasks:
            rid = inbox_task.owner.ref_id
            if rid not in inbox_tasks_by_project_ref_id:
                inbox_tasks_by_project_ref_id[rid] = []
            inbox_tasks_by_project_ref_id[rid].append(inbox_task)

        # Compute stats for each project
        for project in all_projects:
            inbox_tasks = inbox_tasks_by_project_ref_id.get(project.ref_id, [])
            all_inbox_tasks_cnt = len(inbox_tasks)
            completed_inbox_tasks_cnt = sum(
                1 for task in inbox_tasks if task.is_completed
            )

            new_project_stats = ProjectStats.new_stats_for_project(
                ctx,
                project_ref_id=project.ref_id,
                all_inbox_tasks_cnt=all_inbox_tasks_cnt,
                completed_inbox_tasks_cnt=completed_inbox_tasks_cnt,
            )

            async with self._domain_storage_engine.get_unit_of_work() as uow:
                new_project_stats = await uow.get(ProjectStatsRepository).save(
                    new_project_stats
                )
            await progress_reporter.mark_updated(project)
            stats_log_entry = stats_log_entry.add_entity_updated(ctx, project)

        return stats_log_entry

    async def _compute_stats_for_journals(
        self,
        ctx: DomainContext,
        user: User,
        workspace: Workspace,
        progress_reporter: ProgressReporter,
        all_journals: list[Journal],
        stats_log_entry: StatsLogEntry,
    ) -> StatsLogEntry:
        report_service = ReportService(self._domain_storage_engine)

        for journal in all_journals:
            report_period_result = await report_service.do_it(
                user=user,
                workspace=workspace,
                today=journal.right_now,
                period=journal.period,
            )

            new_journal_stats = JournalStats.new_stats_for_journal(
                ctx,
                journal_ref_id=journal.ref_id,
                report=report_period_result,
            )

            async with self._domain_storage_engine.get_unit_of_work() as uow:
                new_journal_stats = await uow.get(JournalStatsRepository).save(
                    new_journal_stats
                )
            await progress_reporter.mark_updated(journal)
            stats_log_entry = stats_log_entry.add_entity_updated(ctx, journal)

        return stats_log_entry

    async def _compute_stats_for_gamification(
        self,
        ctx: DomainContext,
        user: User,
        workspace: Workspace,
        progress_reporter: ProgressReporter,
        all_inbox_tasks_last_year: list[InboxTask],
        all_projects_last_year: list[Project],
        stats_log_entry: StatsLogEntry,
    ) -> StatsLogEntry:
        record_score_service = RecordScoreService()
        for inbox_task in all_inbox_tasks_last_year:
            async with self._domain_storage_engine.get_unit_of_work() as uow:
                record_score_result = await record_score_service.record_task(
                    ctx,
                    uow,
                    user,
                    inbox_task,
                )
                if record_score_result is not None:
                    stats_log_entry = stats_log_entry.add_entity_updated(
                        ctx, inbox_task
                    )

        for project in all_projects_last_year:
            async with self._domain_storage_engine.get_unit_of_work() as uow:
                record_score_result = await record_score_service.record_task(
                    ctx,
                    uow,
                    user,
                    project,
                )
                if record_score_result is not None:
                    await progress_reporter.mark_updated(project)
                    stats_log_entry = stats_log_entry.add_entity_updated(ctx, project)

        return stats_log_entry
