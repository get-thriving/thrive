"""The domain service which constructs a report."""

from collections import defaultdict
from collections.abc import Iterable
from itertools import groupby
from operator import itemgetter
from typing import Final, cast

from jupiter.core.big_plans.collection import BigPlanCollection
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.big_plans.status import BigPlanStatus
from jupiter.core.chores.collection import ChoreCollection
from jupiter.core.chores.root import Chore
from jupiter.core.common import schedules
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.schedules import Schedule
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.common.sub.inbox_tasks.source import InboxTaskSource
from jupiter.core.common.sub.inbox_tasks.status import InboxTaskStatus
from jupiter.core.features import (
    UserFeature,
    WorkspaceFeature,
)
from jupiter.core.gamification.service.score_overview import (
    ScoreOverviewService,
)
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.habits.root import Habit
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.name import AspectName
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.metrics.collection import MetricCollection
from jupiter.core.metrics.root import Metric
from jupiter.core.prm.root import PRM
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.report.breakdown import ReportBreakdown
from jupiter.core.report.period_result import (
    BigPlanWorkSummary,
    InboxTasksSummary,
    NestedResult,
    NestedResultPerSource,
    PerAspectBreakdownItem,
    PerBigPlanBreakdownItem,
    PerChoreBreakdownItem,
    PerGoalBreakdownItem,
    PerHabitBreakdownItem,
    PerPeriodBreakdownItem,
    RecurringTaskWorkSummary,
    ReportPeriodResult,
    WorkableBigPlan,
    WorkableSummary,
)
from jupiter.core.users.root import User
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.entity import NoFilter
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainStorageEngine
from jupiter.framework.use_case import UnavailableForContextError


class ReportService:
    """The domain service which constructs a report."""

    _storage_engine: Final[DomainStorageEngine]

    def __init__(self, domain_storage_engine: DomainStorageEngine) -> None:
        """Constructor."""
        self._storage_engine = domain_storage_engine

    async def do_it(
        self,
        user: User,
        workspace: Workspace,
        today: ADate,
        period: RecurringTaskPeriod,
        sources: list[InboxTaskSource] | None = None,
        breakdowns: list[ReportBreakdown] | None = None,
        filter_aspect_ref_ids: list[EntityId] | None = None,
        filter_big_plan_ref_ids: list[EntityId] | None = None,
        filter_habit_ref_ids: list[EntityId] | None = None,
        filter_chore_ref_ids: list[EntityId] | None = None,
        filter_metric_ref_ids: list[EntityId] | None = None,
        filter_person_ref_ids: list[EntityId] | None = None,
        filter_slack_task_ref_ids: list[EntityId] | None = None,
        filter_email_task_ref_ids: list[EntityId] | None = None,
        breakdown_period: RecurringTaskPeriod | None = None,
    ) -> ReportPeriodResult:
        """Compute the report."""
        if (
            not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and filter_aspect_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
        if (
            not workspace.is_feature_available(WorkspaceFeature.HABITS)
            and filter_habit_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.HABITS)
        if (
            not workspace.is_feature_available(WorkspaceFeature.CHORES)
            and filter_chore_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.CHORES)
        if (
            not workspace.is_feature_available(WorkspaceFeature.METRICS)
            and filter_metric_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.METRICS)
        if (
            not workspace.is_feature_available(WorkspaceFeature.PRM)
            and filter_person_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.PRM)
        if (
            not workspace.is_feature_available(WorkspaceFeature.SLACK_TASKS)
            and filter_slack_task_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.SLACK_TASKS)
        if (
            not workspace.is_feature_available(WorkspaceFeature.EMAIL_TASKS)
            and filter_email_task_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.EMAIL_TASKS)

        sources = (
            sources
            if sources is not None
            else workspace.infer_sources_for_enabled_features(None)
        )

        big_diff = list(
            set(sources).difference(
                workspace.infer_sources_for_enabled_features(sources)
            )
        )
        if len(big_diff) > 0:
            raise UnavailableForContextError(
                f"Sources {','.join(s.value for s in big_diff)} are not supported in this workspace"
            )

        breakdowns = (
            breakdowns
            if breakdowns is not None and len(breakdowns) > 0
            else [ReportBreakdown.GLOBAL]
        )

        if ReportBreakdown.PERIODS in breakdowns:
            if breakdown_period is None:
                breakdown_period = self._one_smaller_than_period(period)

        if breakdown_period:
            self._check_period_against_breakdown_period(
                breakdown_period,
                period,
            )

        async with self._storage_engine.get_unit_of_work() as uow:
            life_plan = await uow.get_for(LifePlan).load_by_parent(
                workspace.ref_id,
            )
            aspects = await uow.get_for(Aspect).find_all_generic(
                parent_ref_id=life_plan.ref_id,
                allow_archived=True,
                ref_id=filter_aspect_ref_ids or NoFilter(),
            )
            filter_aspect_ref_ids = [p.ref_id for p in aspects]
            aspects_by_ref_id: dict[EntityId, Aspect] = {p.ref_id: p for p in aspects}
            aspects_by_name: dict[AspectName, Aspect] = {p.name: p for p in aspects}

            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(
                workspace.ref_id,
            )
            habit_collection = await uow.get_for(HabitCollection).load_by_parent(
                workspace.ref_id,
            )
            chore_collection = await uow.get_for(ChoreCollection).load_by_parent(
                workspace.ref_id,
            )
            big_plan_collection = await uow.get_for(BigPlanCollection).load_by_parent(
                workspace.ref_id,
            )

            metric_collection = await uow.get_for(MetricCollection).load_by_parent(
                workspace.ref_id,
            )
            metrics = await uow.get_for(Metric).find_all(
                parent_ref_id=metric_collection.ref_id,
                allow_archived=True,
                filter_ref_ids=filter_metric_ref_ids,
            )
            metrics_by_ref_id: dict[EntityId, Metric] = {m.ref_id: m for m in metrics}

            prm = await uow.get_for(PRM).load_by_parent(
                workspace.ref_id,
            )
            persons = await uow.get_for(Person).find_all(
                parent_ref_id=prm.ref_id,
                allow_archived=True,
                filter_ref_ids=filter_person_ref_ids,
            )
            persons_by_ref_id = {p.ref_id: p for p in persons}

            schedule = schedules.get_schedule(
                period,
                EntityName("Helper"),
                today.to_timestamp_at_end_of_day(),
                None,
                None,
                None,
                None,
                None,
            )

            raw_all_inbox_tasks = await uow.get(
                InboxTaskRepository
            ).find_modified_in_range(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                filter_sources=sources,
                filter_last_modified_time_start=schedule.first_day,
                filter_last_modified_time_end=schedule.end_day.next_day(),
            )
            all_inbox_tasks = [
                it
                for it in raw_all_inbox_tasks
                # (source is BIG_PLAN and (need to filter then (big_plan_ref_id in filter))
                if it.source is InboxTaskSource.TODO_TASK
                or (
                    it.source is InboxTaskSource.BIG_PLAN
                    and (
                        not (filter_big_plan_ref_ids is not None)
                        or it.source_entity_ref_id in filter_big_plan_ref_ids
                    )
                )
                or (
                    it.source is InboxTaskSource.HABIT
                    and (
                        not (filter_habit_ref_ids is not None)
                        or it.source_entity_ref_id in filter_habit_ref_ids
                    )
                )
                or (
                    it.source is InboxTaskSource.CHORE
                    and (
                        not (filter_chore_ref_ids is not None)
                        or it.source_entity_ref_id in filter_chore_ref_ids
                    )
                )
                or (
                    it.source is InboxTaskSource.METRIC
                    and it.source_entity_ref_id in metrics_by_ref_id
                )
                or (
                    (
                        it.source is InboxTaskSource.PERSON_CATCH_UP
                        or it.source is InboxTaskSource.PERSON_OCCASION
                    )
                    and it.source_entity_ref_id in persons_by_ref_id
                )
                or (
                    it.source is InboxTaskSource.SLACK_TASK
                    and (
                        not (filter_slack_task_ref_ids is not None)
                        or it.source_entity_ref_id in filter_slack_task_ref_ids
                    )
                )
                or (
                    it.source is InboxTaskSource.EMAIL_TASK
                    and (
                        not (filter_email_task_ref_ids is not None)
                        or it.source_entity_ref_id in filter_email_task_ref_ids
                    )
                )
            ]

            all_habits = await uow.get_for(Habit).find_all_generic(
                parent_ref_id=habit_collection.ref_id,
                allow_archived=True,
                ref_id=filter_habit_ref_ids or NoFilter(),
                aspect_ref_id=filter_aspect_ref_ids or NoFilter(),
            )
            all_habits_by_ref_id: dict[EntityId, Habit] = {
                rt.ref_id: rt for rt in all_habits
            }

            all_chores = await uow.get_for(Chore).find_all_generic(
                parent_ref_id=chore_collection.ref_id,
                allow_archived=True,
                ref_id=filter_chore_ref_ids or NoFilter(),
                aspect_ref_id=filter_aspect_ref_ids or NoFilter(),
            )
            all_chores_by_ref_id: dict[EntityId, Chore] = {
                rt.ref_id: rt for rt in all_chores
            }

            all_goals = await uow.get_for(Goal).find_all_generic(
                parent_ref_id=life_plan.ref_id,
                allow_archived=True,
                ref_id=NoFilter(),
            )
            all_goals_by_ref_id: dict[EntityId, Goal] = {g.ref_id: g for g in all_goals}

            all_big_plans = await uow.get_for(BigPlan).find_all_generic(
                parent_ref_id=big_plan_collection.ref_id,
                allow_archived=True,
                ref_id=filter_big_plan_ref_ids or NoFilter(),
                aspect_ref_id=filter_aspect_ref_ids or NoFilter(),
            )
            big_plans_by_ref_id: dict[EntityId, BigPlan] = {
                bp.ref_id: bp for bp in all_big_plans
            }

        global_inbox_tasks_summary = self._run_report_for_inbox_tasks(
            schedule,
            all_inbox_tasks,
        )

        if workspace.is_feature_available(WorkspaceFeature.BIG_PLANS):
            global_big_plans_summary = self._run_report_for_big_plan(
                schedule,
                all_big_plans,
            )
        else:
            global_big_plans_summary = WorkableSummary(
                created_cnt=0,
                not_started_cnt=0,
                working_cnt=0,
                not_done_cnt=0,
                done_cnt=0,
                not_done_big_plans=[],
                done_big_plans=[],
            )

        # Build per aspect breakdown

        if workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            if workspace.is_feature_available(WorkspaceFeature.BIG_PLANS):
                # all_big_plans.groupBy(it -> it.aspect..name).map((k, v) -> (k, run_report_for_group(v))).asDict()
                per_aspect_big_plans_summary = {
                    k: self._run_report_for_big_plan(schedule, (vx[1] for vx in v))
                    for (k, v) in groupby(
                        sorted(
                            [
                                (aspects_by_ref_id[bp.aspect_ref_id].name, bp)
                                for bp in all_big_plans
                            ],
                            key=itemgetter(0),
                        ),
                        key=itemgetter(0),
                    )
                }
            else:
                per_aspect_big_plans_summary = {}

            all_aspect_names = per_aspect_big_plans_summary.keys()
            per_aspect_breakdown = [
                PerAspectBreakdownItem(
                    ref_id=aspects_by_name[s].ref_id,
                    name=s,
                    big_plans_summary=per_aspect_big_plans_summary.get(
                        s,
                        WorkableSummary(0, 0, 0, 0, 0, [], []),
                    ),
                )
                for s in all_aspect_names
                if s in aspects_by_name
            ]
        else:
            per_aspect_breakdown = []

        # Build per goal breakdown

        if workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            per_goal_inbox_tasks_summary: dict[EntityId, WorkableSummary] = {}

            if workspace.is_feature_available(WorkspaceFeature.BIG_PLANS):
                per_goal_big_plans_summary = {
                    k: self._run_report_for_big_plan(schedule, (vx[1] for vx in v))
                    for (k, v) in groupby(
                        sorted(
                            [
                                (bp.goal_ref_id, bp)
                                for bp in all_big_plans
                                if bp.goal_ref_id is not None
                            ],
                            key=itemgetter(0),
                        ),
                        key=itemgetter(0),
                    )
                }
            else:
                per_goal_big_plans_summary = {}

            all_goal_ref_ids = set(per_goal_inbox_tasks_summary.keys()) | set(
                per_goal_big_plans_summary.keys()
            )
            per_goal_breakdown = [
                PerGoalBreakdownItem(
                    ref_id=goal_ref_id,
                    name=all_goals_by_ref_id[goal_ref_id].name,
                    big_plans_summary=per_goal_big_plans_summary.get(
                        goal_ref_id,
                        WorkableSummary(0, 0, 0, 0, 0, [], []),
                    ),
                )
                for goal_ref_id in all_goal_ref_ids
                if goal_ref_id in all_goals_by_ref_id
                and not all_goals_by_ref_id[goal_ref_id].archived
            ]
        else:
            per_goal_breakdown = []

        # Build per period breakdown
        per_period_breakdown = []
        if breakdown_period:
            all_schedules = {}
            curr_date = schedule.first_day
            end_date = schedule.end_day
            while curr_date <= end_date and curr_date <= today:
                phase_schedule = schedules.get_schedule(
                    breakdown_period,
                    EntityName("Sub-period"),
                    curr_date.to_timestamp_at_end_of_day(),
                    None,
                    None,
                    None,
                    None,
                    None,
                )
                all_schedules[phase_schedule.full_name] = phase_schedule
                curr_date = curr_date.next_day()

            per_period_inbox_tasks_summary = {
                k: self._run_report_for_inbox_tasks(v, all_inbox_tasks)
                for (k, v) in all_schedules.items()
            }
            per_period_big_plans_summary = {
                k: self._run_report_for_big_plan(v, all_big_plans)
                for (k, v) in all_schedules.items()
            }
            per_period_breakdown = [
                PerPeriodBreakdownItem(
                    name=k,
                    inbox_tasks_summary=v,
                    big_plans_summary=per_period_big_plans_summary.get(
                        k,
                        WorkableSummary(0, 0, 0, 0, 0, [], []),
                    ),
                )
                for (k, v) in per_period_inbox_tasks_summary.items()
            ]

        # Build per habit breakdown

        # all_inbox_tasks.groupBy(it -> it.habit.name).map((k, v) -> (k, run_report_for_group(v))).asDict()
        if workspace.is_feature_available(WorkspaceFeature.HABITS):
            per_habit_breakdown = [
                hb
                for hb in (
                    PerHabitBreakdownItem(
                        ref_id=all_habits_by_ref_id[k].ref_id,
                        name=all_habits_by_ref_id[k].name,
                        archived=all_habits_by_ref_id[k].archived,
                        suspended=all_habits_by_ref_id[k].suspended,
                        period=all_habits_by_ref_id[k].gen_params.period,
                        summary=self._run_report_for_inbox_for_recurring_tasks(
                            schedule,
                            [vx[1] for vx in v],
                        ),
                    )
                    for (k, v) in groupby(
                        sorted(
                            [
                                (it.source_entity_ref_id, it)
                                for it in all_inbox_tasks
                                if it.source == InboxTaskSource.HABIT
                            ],
                            key=itemgetter(0),
                        ),
                        key=itemgetter(0),
                    )
                )
                if all_habits_by_ref_id[hb.ref_id].archived is False
            ]
        else:
            per_habit_breakdown = []

        # Build per chore breakdown

        # all_inbox_tasks.groupBy(it -> it.chore.name).map((k, v) -> (k, run_report_for_group(v))).asDict()
        if workspace.is_feature_available(WorkspaceFeature.CHORES):
            per_chore_breakdown = [
                cb
                for cb in (
                    PerChoreBreakdownItem(
                        ref_id=all_chores_by_ref_id[k].ref_id,
                        name=all_chores_by_ref_id[k].name,
                        suspended=all_chores_by_ref_id[k].suspended,
                        archived=all_chores_by_ref_id[k].archived,
                        period=all_chores_by_ref_id[k].gen_params.period,
                        summary=self._run_report_for_inbox_for_recurring_tasks(
                            schedule,
                            [vx[1] for vx in v],
                        ),
                    )
                    for (k, v) in groupby(
                        sorted(
                            [
                                (it.source_entity_ref_id, it)
                                for it in all_inbox_tasks
                                if it.source == InboxTaskSource.CHORE
                            ],
                            key=itemgetter(0),
                        ),
                        key=itemgetter(0),
                    )
                )
                if all_chores_by_ref_id[cb.ref_id].archived is False
            ]
        else:
            per_chore_breakdown = []

        # Build per big plan breakdown

        # all_inbox_tasks.groupBy(it -> it.bigPlan.name).map((k, v) -> (k, run_report_for_group(v))).asDict()
        if workspace.is_feature_available(WorkspaceFeature.BIG_PLANS):
            per_big_plan_breakdown = [
                bb
                for bb in (
                    PerBigPlanBreakdownItem(
                        ref_id=big_plans_by_ref_id[k].ref_id,
                        name=big_plans_by_ref_id[k].name,
                        actionable_date=big_plans_by_ref_id[k].actionable_date,
                        summary=self._run_report_for_inbox_tasks_for_big_plan(
                            schedule,
                            (vx[1] for vx in v),
                        ),
                    )
                    for (k, v) in groupby(
                        sorted(
                            [
                                (it.source_entity_ref_id, it)
                                for it in all_inbox_tasks
                                if it.source == InboxTaskSource.BIG_PLAN
                            ],
                            key=itemgetter(0),
                        ),
                        key=itemgetter(0),
                    )
                )
                if big_plans_by_ref_id[bb.ref_id].archived is False
            ]
        else:
            per_big_plan_breakdown = []

        # Build user scores overview.
        user_score_overview = None
        if user.is_feature_available(UserFeature.GAMIFICATION):
            async with self._storage_engine.get_unit_of_work() as uow:
                user_score_overview = await ScoreOverviewService().do_it(
                    uow, user, today.to_timestamp_at_end_of_day()
                )

        return ReportPeriodResult(
            today=today,
            period=period,
            sources=sources,
            breakdowns=breakdowns,
            breakdown_period=breakdown_period,
            global_inbox_tasks_summary=global_inbox_tasks_summary,
            global_big_plans_summary=global_big_plans_summary,
            per_aspect_breakdown=per_aspect_breakdown,
            per_goal_breakdown=per_goal_breakdown,
            per_period_breakdown=per_period_breakdown,
            per_habit_breakdown=per_habit_breakdown,
            per_chore_breakdown=per_chore_breakdown,
            per_big_plan_breakdown=per_big_plan_breakdown,
            user_score_overview=user_score_overview,
        )

    @staticmethod
    def _run_report_for_inbox_tasks(
        schedule: Schedule,
        inbox_tasks: Iterable[InboxTask],
    ) -> InboxTasksSummary:
        created_cnt_total = 0
        created_per_source_cnt: defaultdict[InboxTaskSource, int] = defaultdict(int)
        not_started_cnt_total = 0
        not_started_per_source_cnt: defaultdict[InboxTaskSource, int] = defaultdict(int)
        working_cnt_total = 0
        working_per_source_cnt: defaultdict[InboxTaskSource, int] = defaultdict(int)
        done_cnt_total = 0
        done_per_source_cnt: defaultdict[InboxTaskSource, int] = defaultdict(int)
        not_done_cnt_total = 0
        not_done_per_source_cnt: defaultdict[InboxTaskSource, int] = defaultdict(int)

        for inbox_task in inbox_tasks:
            if schedule.contains_timestamp(inbox_task.created_time):
                created_cnt_total += 1
                created_per_source_cnt[inbox_task.source] += 1

            if inbox_task.status.is_completed and schedule.contains_timestamp(
                cast(Timestamp, inbox_task.completed_time),
            ):
                if inbox_task.status == InboxTaskStatus.DONE:
                    done_cnt_total += 1
                    done_per_source_cnt[inbox_task.source] += 1
                else:
                    not_done_cnt_total += 1
                    not_done_per_source_cnt[inbox_task.source] += 1
            elif inbox_task.status.is_working and schedule.contains_timestamp(
                cast(Timestamp, inbox_task.working_time),
            ):
                working_cnt_total += 1
                working_per_source_cnt[inbox_task.source] += 1
            else:
                not_started_cnt_total += 1
                not_started_per_source_cnt[inbox_task.source] += 1

        return InboxTasksSummary(
            created=NestedResult(
                total_cnt=created_cnt_total,
                per_source_cnt=list(
                    NestedResultPerSource(a, b)
                    for a, b in created_per_source_cnt.items()
                ),
            ),
            not_started=NestedResult(
                total_cnt=not_started_cnt_total,
                per_source_cnt=list(
                    NestedResultPerSource(a, b)
                    for a, b in not_started_per_source_cnt.items()
                ),
            ),
            working=NestedResult(
                total_cnt=working_cnt_total,
                per_source_cnt=list(
                    NestedResultPerSource(a, b)
                    for a, b in working_per_source_cnt.items()
                ),
            ),
            not_done=NestedResult(
                total_cnt=not_done_cnt_total,
                per_source_cnt=list(
                    NestedResultPerSource(a, b)
                    for a, b in not_done_per_source_cnt.items()
                ),
            ),
            done=NestedResult(
                total_cnt=done_cnt_total,
                per_source_cnt=list(
                    NestedResultPerSource(a, b) for a, b in done_per_source_cnt.items()
                ),
            ),
        )

    @staticmethod
    def _run_report_for_inbox_tasks_for_big_plan(
        schedule: Schedule,
        inbox_tasks: Iterable[InboxTask],
    ) -> BigPlanWorkSummary:
        created_cnt = 0
        not_started_cnt = 0
        working_cnt = 0
        done_cnt = 0
        not_done_cnt = 0

        for inbox_task in inbox_tasks:
            if schedule.contains_timestamp(inbox_task.created_time):
                created_cnt += 1

            if inbox_task.status.is_completed and schedule.contains_timestamp(
                cast(Timestamp, inbox_task.completed_time),
            ):
                if inbox_task.status == InboxTaskStatus.DONE:
                    done_cnt += 1
                else:
                    not_done_cnt += 1
            elif inbox_task.status.is_working and schedule.contains_timestamp(
                cast(Timestamp, inbox_task.working_time),
            ):
                working_cnt += 1
            else:
                not_started_cnt += 1

        return BigPlanWorkSummary(
            created_cnt=created_cnt,
            not_started_cnt=not_started_cnt,
            working_cnt=working_cnt,
            not_done_cnt=not_done_cnt,
            not_done_ratio=(
                not_done_cnt / float(created_cnt) if created_cnt > 0 else 0.0
            ),
            done_cnt=done_cnt,
            done_ratio=done_cnt / float(created_cnt) if created_cnt > 0 else 0,
        )

    @staticmethod
    def _run_report_for_inbox_for_recurring_tasks(
        schedule: Schedule,
        inbox_tasks: list[InboxTask],
    ) -> RecurringTaskWorkSummary:
        # The simple summary computations here.
        created_cnt = 0
        not_started_cnt = 0
        working_cnt = 0
        done_cnt = 0
        not_done_cnt = 0

        for inbox_task in inbox_tasks:
            if schedule.contains_timestamp(inbox_task.created_time):
                created_cnt += 1

            if inbox_task.status.is_completed and schedule.contains_timestamp(
                cast(Timestamp, inbox_task.completed_time),
            ):
                if inbox_task.status == InboxTaskStatus.DONE:
                    done_cnt += 1
                else:
                    not_done_cnt += 1
            elif inbox_task.status.is_working and schedule.contains_timestamp(
                cast(Timestamp, inbox_task.working_time),
            ):
                working_cnt += 1
            else:
                not_started_cnt += 1

        return RecurringTaskWorkSummary(
            created_cnt=created_cnt,
            not_started_cnt=not_started_cnt,
            working_cnt=working_cnt,
            not_done_cnt=not_done_cnt,
            not_done_ratio=(
                not_done_cnt / float(created_cnt) if created_cnt > 0 else 0.0
            ),
            done_cnt=done_cnt,
            done_ratio=done_cnt / float(created_cnt) if created_cnt > 0 else 0.0,
            streak_plot="",
        )

    @staticmethod
    def _run_report_for_big_plan(
        schedule: Schedule,
        big_plans: Iterable[BigPlan],
    ) -> "WorkableSummary":
        created_cnt = 0
        not_started_cnt = 0
        working_cnt = 0
        not_done_cnt = 0
        done_cnt = 0
        not_done_aspects = []
        done_aspects = []

        for big_plan in big_plans:
            if schedule.contains_timestamp(big_plan.created_time):
                created_cnt += 1

            if big_plan.status.is_completed and schedule.contains_timestamp(
                cast(Timestamp, big_plan.completed_time),
            ):
                if big_plan.status == BigPlanStatus.DONE:
                    done_cnt += 1
                    done_aspects.append(
                        WorkableBigPlan(
                            ref_id=big_plan.ref_id,
                            name=big_plan.name,
                            actionable_date=big_plan.actionable_date,
                        ),
                    )
                else:
                    not_done_cnt += 1
                    not_done_aspects.append(
                        WorkableBigPlan(
                            ref_id=big_plan.ref_id,
                            name=big_plan.name,
                            actionable_date=big_plan.actionable_date,
                        ),
                    )
            elif big_plan.status.is_working and schedule.contains_timestamp(
                cast(Timestamp, big_plan.working_time),
            ):
                working_cnt += 1
            else:
                not_started_cnt += 1

        return WorkableSummary(
            created_cnt=created_cnt,
            not_started_cnt=not_started_cnt,
            working_cnt=working_cnt,
            done_cnt=done_cnt,
            not_done_cnt=not_done_cnt,
            not_done_big_plans=not_done_aspects,
            done_big_plans=done_aspects,
        )

    @staticmethod
    def _one_smaller_than_period(period: RecurringTaskPeriod) -> RecurringTaskPeriod:
        if period == RecurringTaskPeriod.YEARLY:
            return RecurringTaskPeriod.QUARTERLY
        elif period == RecurringTaskPeriod.QUARTERLY:
            return RecurringTaskPeriod.MONTHLY
        elif period == RecurringTaskPeriod.MONTHLY:
            return RecurringTaskPeriod.WEEKLY
        elif period == RecurringTaskPeriod.WEEKLY:
            return RecurringTaskPeriod.DAILY
        else:
            raise InputValidationError("Cannot breakdown daily by period")

    @staticmethod
    def _check_period_against_breakdown_period(
        breakdown_period: RecurringTaskPeriod,
        period: RecurringTaskPeriod,
    ) -> None:
        breakdown_period_idx = [v.value for v in RecurringTaskPeriod].index(
            breakdown_period.value,
        )
        period_idx = [v.value for v in RecurringTaskPeriod].index(period.value)
        if breakdown_period_idx >= period_idx:
            raise InputValidationError(
                f"Cannot breakdown {period} with {breakdown_period}",
            )
