"""A use case for retrieving summaries about entities."""

from jupiter.core.application.fast_info_repository import (
    BigPlanSummary,
    ChapterSummary,
    ChoreSummary,
    FastInfoRepository,
    GoalSummary,
    HabitSummary,
    InboxTaskSummary,
    JournalSummary,
    MetricSummary,
    MilestoneSummary,
    PersonSummary,
    ProjectSummary,
    ScheduleStreamSummary,
    SmartListSummary,
    VacationSummary,
)
from jupiter.core.big_plans.collection import BigPlanCollection
from jupiter.core.chores.collection import ChoreCollection
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.journals.collection import JournalCollection
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import ProjectRepository
from jupiter.core.life_plan.sub.visions.root import Vision
from jupiter.core.life_plan.sub.visions.status import VisionStatus
from jupiter.core.metrics.collection import MetricCollection
from jupiter.core.persons.collection import PersonCollection
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.smart_lists.collection import (
    SmartListCollection,
)
from jupiter.core.users.root import User
from jupiter.core.vacations.collection import VacationCollection
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class GetSummariesArgs(UseCaseArgsBase):
    """Get summaries args."""

    allow_archived: bool | None
    include_user: bool | None
    include_workspace: bool | None
    include_life_plan: bool | None
    include_active_visions: bool | None
    include_schedule_streams: bool | None
    include_vacations: bool | None
    include_projects: bool | None
    include_chapters: bool | None
    include_goals: bool | None
    include_milestones: bool | None
    include_inbox_tasks: bool | None
    include_journals_last_year: bool | None
    include_habits: bool | None
    include_chores: bool | None
    include_big_plans: bool | None
    include_smart_lists: bool | None
    include_metrics: bool | None
    include_persons: bool | None


@use_case_result
class GetSummariesResult(UseCaseResultBase):
    """Get summaries result."""

    user: User | None
    workspace: Workspace | None
    life_plan: LifePlan | None
    active_vision: Vision | None
    vacations: list[VacationSummary] | None
    schedule_streams: list[ScheduleStreamSummary] | None
    root_project: ProjectSummary | None
    projects: list[ProjectSummary] | None
    chapters: list[ChapterSummary] | None
    goals: list[GoalSummary] | None
    milestones: list[MilestoneSummary] | None
    inbox_tasks: list[InboxTaskSummary] | None
    journals_last_year: list[JournalSummary] | None
    habits: list[HabitSummary] | None
    chores: list[ChoreSummary] | None
    big_plans: list[BigPlanSummary] | None
    smart_lists: list[SmartListSummary] | None
    metrics: list[MetricSummary] | None
    persons: list[PersonSummary] | None


@readonly_use_case()
class GetSummariesUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[GetSummariesArgs, GetSummariesResult]
):
    """The use case for retrieving summaries about entities."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: GetSummariesArgs,
    ) -> GetSummariesResult:
        """Execute the command."""
        user = context.user
        workspace = context.workspace
        allow_archived = args.allow_archived is True

        vacation_collection = await uow.get_for(VacationCollection).load_by_parent(
            workspace.ref_id,
        )
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )
        schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
            workspace.ref_id
        )
        life_plan = await uow.get_for(LifePlan).load_by_parent(
            workspace.ref_id,
        )
        habit_collection = await uow.get_for(HabitCollection).load_by_parent(
            workspace.ref_id,
        )
        chore_collection = await uow.get_for(ChoreCollection).load_by_parent(
            workspace.ref_id,
        )
        journal_collection = await uow.get_for(JournalCollection).load_by_parent(
            workspace.ref_id,
        )
        big_plan_collection = await uow.get_for(BigPlanCollection).load_by_parent(
            workspace.ref_id,
        )
        smart_list_collection = await uow.get_for(SmartListCollection).load_by_parent(
            workspace.ref_id,
        )
        metric_collection = await uow.get_for(MetricCollection).load_by_parent(
            workspace.ref_id,
        )
        person_collection = await uow.get_for(PersonCollection).load_by_parent(
            workspace.ref_id,
        )

        vacations = None
        if (
            workspace.is_feature_available(WorkspaceFeature.VACATIONS)
            and args.include_vacations
        ):
            vacations = await uow.get(FastInfoRepository).find_all_vacation_summaries(
                parent_ref_id=vacation_collection.workspace.ref_id,
                allow_archived=allow_archived,
            )

        active_vision = None
        if (
            workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and args.include_active_visions
        ):
            active_visions = await uow.get_for(Vision).find_all_generic(
                parent_ref_id=life_plan.ref_id,
                allow_archived=False,
                status=VisionStatus.ACTIVE,
            )
            if len(active_visions) > 0:
                active_vision = active_visions[0]

        schedule_streams = None
        if (
            workspace.is_feature_available(WorkspaceFeature.SCHEDULE)
            and args.include_schedule_streams
        ):
            schedule_streams = await uow.get(
                FastInfoRepository
            ).find_all_schedule_stream_summaries(
                parent_ref_id=schedule_domain.workspace.ref_id,
                allow_archived=allow_archived,
            )

        root_project_real = await uow.get(ProjectRepository).load_root_project(
            life_plan.ref_id
        )
        root_project = ProjectSummary(
            ref_id=root_project_real.ref_id,
            parent_project_ref_id=root_project_real.parent_ref_id,
            name=root_project_real.name,
            order_of_child_projects=root_project_real.order_of_child_projects,
        )
        projects = None
        if (
            workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and args.include_projects
        ):
            projects = await uow.get(FastInfoRepository).find_all_project_summaries(
                parent_ref_id=life_plan.workspace.ref_id,
                allow_archived=allow_archived,
            )
        inbox_tasks = None
        if (
            workspace.is_feature_available(WorkspaceFeature.INBOX_TASKS)
            and args.include_inbox_tasks
        ):
            inbox_tasks = await uow.get(
                FastInfoRepository
            ).find_all_inbox_task_summaries(
                parent_ref_id=inbox_task_collection.workspace.ref_id,
                allow_archived=allow_archived,
            )

        chapters = None
        if (
            workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and args.include_chapters
        ):
            chapters = await uow.get(FastInfoRepository).find_all_chapter_summaries(
                parent_ref_id=life_plan.workspace.ref_id,
                allow_archived=allow_archived,
            )

        milestones = None
        if (
            workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and args.include_milestones
        ):
            milestones = await uow.get(FastInfoRepository).find_all_milestone_summaries(
                parent_ref_id=life_plan.workspace.ref_id,
                allow_archived=allow_archived,
            )

        goals = None
        if (
            workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and args.include_goals
        ):
            goals = await uow.get(FastInfoRepository).find_all_goal_summaries(
                parent_ref_id=life_plan.workspace.ref_id,
                allow_archived=allow_archived,
            )

        journals_last_year = None
        if (
            workspace.is_feature_available(WorkspaceFeature.JOURNALS)
            and args.include_journals_last_year
        ):
            journals_last_year = await uow.get(
                FastInfoRepository
            ).find_all_journal_summaries(
                parent_ref_id=journal_collection.workspace.ref_id,
                allow_archived=allow_archived,
                filter_start_date=self._time_provider.get_current_date().subtract_days(
                    400
                ),
                filter_end_date=self._time_provider.get_current_date().add_days(30),
            )

        habits = None
        if (
            workspace.is_feature_available(WorkspaceFeature.HABITS)
            and args.include_habits
        ):
            habits = await uow.get(FastInfoRepository).find_all_habit_summaries(
                parent_ref_id=habit_collection.workspace.ref_id,
                allow_archived=allow_archived,
            )
        chores = None
        if (
            workspace.is_feature_available(WorkspaceFeature.CHORES)
            and args.include_chores
        ):
            chores = await uow.get(FastInfoRepository).find_all_chore_summaries(
                parent_ref_id=chore_collection.workspace.ref_id,
                allow_archived=allow_archived,
            )
        big_plans = None
        if (
            workspace.is_feature_available(WorkspaceFeature.BIG_PLANS)
            and args.include_big_plans
        ):
            big_plans = await uow.get(FastInfoRepository).find_all_big_plan_summaries(
                parent_ref_id=big_plan_collection.workspace.ref_id,
                allow_archived=allow_archived,
            )
        smart_lists = None
        if (
            workspace.is_feature_available(WorkspaceFeature.SMART_LISTS)
            and args.include_smart_lists
        ):
            smart_lists = await uow.get(
                FastInfoRepository
            ).find_all_smart_list_summaries(
                parent_ref_id=smart_list_collection.workspace.ref_id,
                allow_archived=allow_archived,
            )
        metrics = None
        if (
            workspace.is_feature_available(WorkspaceFeature.METRICS)
            and args.include_metrics
        ):
            metrics = await uow.get(FastInfoRepository).find_all_metric_summaries(
                parent_ref_id=metric_collection.workspace.ref_id,
                allow_archived=allow_archived,
            )
        persons = None
        if (
            workspace.is_feature_available(WorkspaceFeature.PERSONS)
            and args.include_persons
        ):
            persons = await uow.get(FastInfoRepository).find_all_person_summaries(
                parent_ref_id=person_collection.workspace.ref_id,
                allow_archived=allow_archived,
            )

        return GetSummariesResult(
            user=user if args.include_user else None,
            workspace=workspace if args.include_workspace else None,
            life_plan=life_plan if args.include_life_plan else None,
            active_vision=active_vision,
            schedule_streams=schedule_streams,
            vacations=vacations,
            root_project=root_project,
            projects=projects,
            chapters=chapters,
            goals=goals,
            milestones=milestones,
            inbox_tasks=inbox_tasks,
            journals_last_year=journals_last_year,
            habits=habits,
            chores=chores,
            big_plans=big_plans,
            smart_lists=smart_lists,
            metrics=metrics,
            persons=persons,
        )
