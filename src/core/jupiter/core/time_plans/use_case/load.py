"""Retrieve details about a time plan."""

from collections import defaultdict
from typing import cast

from jupiter.core.app import AppCore
from jupiter.core.projects.collection import ProjectCollection
from jupiter.core.projects.root import Project, ProjectRepository
from jupiter.core.common import schedules
from jupiter.core.common.sub.inbox_tasks import parent_link_namespace
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.time_plans.life_plan_links import (
    TimePlanAspectLink,
    TimePlanChapterLink,
    TimePlanGoalLink,
)
from jupiter.core.time_plans.root import (
    TimePlan,
    TimePlanRepository,
)
from jupiter.core.time_plans.sub.activity.doneness import (
    TimePlanActivityDoneness,
)
from jupiter.core.time_plans.sub.activity.kind import (
    TimePlanActivityKind,
)
from jupiter.core.time_plans.sub.activity.root import TimePlanActivity
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
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
from jupiter.framework.utils.generic_loader import generic_loader


@use_case_args
class TimePlanLoadArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    allow_archived: bool | None
    include_targets: bool | None
    include_completed_nontarget: bool | None
    include_other_time_plans: bool | None


@use_case_result
class TimePlanLoadResult(UseCaseResultBase):
    """Result."""

    time_plan: TimePlan
    tags: list[Tag]
    note: Note
    activities: list[TimePlanActivity]
    chapters: list[Chapter]
    aspects: list[Aspect]
    goals: list[Goal]
    target_inbox_tasks: list[InboxTask] | None
    target_projects: list[Project] | None
    activity_doneness: dict[EntityId, TimePlanActivityDoneness] | None
    completed_nontarget_inbox_tasks: list[InboxTask] | None
    completed_nottarget_projects: list[Project] | None
    sub_period_time_plans: list[TimePlan] | None
    higher_time_plan: TimePlan | None
    previous_time_plan: TimePlan | None


@readonly_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[TimePlanLoadArgs, TimePlanLoadResult]
):
    """The command for loading details about a time plan."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TimePlanLoadArgs,
    ) -> TimePlanLoadResult:
        """Execute the command's actions."""
        allow_archived = args.allow_archived or False
        include_targets = args.include_targets or False
        include_completed_nontarget = args.include_completed_nontarget or False
        include_other_time_plans = args.include_other_time_plans or False

        workspace = context.workspace

        time_plan, activities, note = await generic_loader(
            uow,
            TimePlan,
            args.ref_id,
            TimePlan.activities,
            TimePlan.note,
            allow_archived=allow_archived,
            allow_subentity_archived=False,
        )

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=EntityLink.std(NamedEntityTag.TIME_PLAN.value, time_plan.ref_id),
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []

        schedule = schedules.get_schedule(
            period=time_plan.period,
            name=time_plan.name,
            right_now=time_plan.right_now.to_timestamp_at_end_of_day(),
        )

        chapters: list[Chapter] = []
        aspects: list[Aspect] = []
        goals: list[Goal] = []
        if workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            life_plan = await uow.get_for(LifePlan).load_by_parent(workspace.ref_id)
            chapter_links = await uow.get_for_record(TimePlanChapterLink).find_all(
                time_plan.ref_id
            )
            aspect_links = await uow.get_for_record(TimePlanAspectLink).find_all(
                time_plan.ref_id
            )
            goal_links = await uow.get_for_record(TimePlanGoalLink).find_all(
                time_plan.ref_id
            )

            chapter_ref_ids = list({link.chapter_ref_id for link in chapter_links})
            aspect_ref_ids = list({link.aspect_ref_id for link in aspect_links})
            goal_ref_ids = list({link.goal_ref_id for link in goal_links})

            if chapter_ref_ids:
                chapters = await uow.get_for(Chapter).find_all(
                    parent_ref_id=life_plan.ref_id,
                    allow_archived=True,
                    filter_ref_ids=chapter_ref_ids,
                )
            if aspect_ref_ids:
                aspects = await uow.get_for(Aspect).find_all(
                    parent_ref_id=life_plan.ref_id,
                    allow_archived=True,
                    filter_ref_ids=aspect_ref_ids,
                )
            if goal_ref_ids:
                goals = await uow.get_for(Goal).find_all(
                    parent_ref_id=life_plan.ref_id,
                    allow_archived=True,
                    filter_ref_ids=goal_ref_ids,
                )

        target_inbox_tasks = None
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id
        )
        if include_targets:
            target_inbox_tasks = await uow.get_for(InboxTask).find_all(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                filter_ref_ids=[
                    a.target.ref_id for a in activities if a.is_target_inbox_task
                ],
            )

        completed_nontarget_inbox_tasks = None
        if include_completed_nontarget and target_inbox_tasks is not None:

            # The rule here should be:
            # If this is a inbox task or project include it always
            # If this is a generated one, then:
            #    If the recurring_task_period is strictly higher than the time plan is we include it
            #    If the recurring_task_period is equal or lower than the time plan one we skip it
            # expressed as: (it.source in (user, project)) or (it.period  in (*all_higher_periods)
            # But this is hard to express cause inbox_tasks don't yet remember the period
            # of their source entity. Inference from the timeline is hard in SQL, etc.
            completed_nontarget_inbox_tasks = await uow.get(
                InboxTaskRepository
            ).find_completed_in_range(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                filter_start_completed_date=schedule.first_day,
                filter_end_completed_date=schedule.end_day,
                filter_include_parent_link_namespaces=[
                    parent_link_namespace.TODO_TASK,
                    parent_link_namespace.PROJECT,
                ],
                filter_exclude_ref_ids=[it.ref_id for it in target_inbox_tasks],
            )

        target_projects = None
        completed_nontarget_projects = None
        if workspace.is_feature_available(WorkspaceFeature.PROJECTS):
            project_collection = await uow.get_for(ProjectCollection).load_by_parent(
                workspace.ref_id
            )

            if include_targets:
                target_projects = await uow.get_for(Project).find_all(
                    parent_ref_id=project_collection.ref_id,
                    allow_archived=True,
                    filter_ref_ids=[
                        a.target.ref_id for a in activities if a.is_target_project
                    ],
                )

            if include_completed_nontarget and target_projects is not None:
                completed_nontarget_projects = await uow.get(
                    ProjectRepository
                ).find_completed_in_range(
                    parent_ref_id=project_collection.ref_id,
                    allow_archived=True,
                    filter_start_completed_date=schedule.first_day,
                    filter_end_completed_date=schedule.end_day,
                    filter_exclude_ref_ids=[bp.ref_id for bp in target_projects],
                )

        activity_doneness = None
        if include_targets:
            activity_doneness = {}
            target_inbox_tasks_by_ref_id = {
                it.ref_id: it for it in cast(list[InboxTask], target_inbox_tasks)
            }
            target_projects_by_ref_id = (
                {bp.ref_id: bp for bp in target_projects} if target_projects else {}
            )
            activities_by_project_ref_id: defaultdict[EntityId, list[EntityId]] = (
                defaultdict(list)
            )

            for activity in activities:
                if not activity.is_target_inbox_task:
                    continue

                inbox_task = target_inbox_tasks_by_ref_id[activity.target.ref_id]

                if activity.kind == TimePlanActivityKind.FINISH:
                    if inbox_task.is_completed:
                        activity_doneness[activity.ref_id] = (
                            TimePlanActivityDoneness.DONE
                        )
                    elif inbox_task.is_working:
                        activity_doneness[activity.ref_id] = (
                            TimePlanActivityDoneness.WORKING
                        )
                    else:
                        activity_doneness[activity.ref_id] = (
                            TimePlanActivityDoneness.NOT_DONE
                        )
                elif activity.kind == TimePlanActivityKind.MAKE_PROGRESS:
                    # A tricky business logic decision.
                    # It's quite often the case that we setup a time plan with an inbox
                    # task where we wish to make progress. But the progress we do is just
                    # a bit after the time plan is created. So we'd still wish to show
                    # this as "done" in whatever view we have. So we add a buffer of a
                    # month afterwards to capture this.
                    modified_in_time_plan = (
                        inbox_task.is_working_or_more
                        and time_plan.start_date.to_timestamp_at_start_of_day()
                        <= inbox_task.last_modified_time
                        and inbox_task.last_modified_time
                        <= time_plan.end_date.add_days(30).to_timestamp_at_end_of_day()
                    )
                    if inbox_task.is_completed or modified_in_time_plan:
                        activity_doneness[activity.ref_id] = (
                            TimePlanActivityDoneness.DONE
                        )
                    elif inbox_task.is_working:
                        activity_doneness[activity.ref_id] = (
                            TimePlanActivityDoneness.WORKING
                        )
                    else:
                        activity_doneness[activity.ref_id] = (
                            TimePlanActivityDoneness.NOT_DONE
                        )

                if inbox_task.owner.the_type == NamedEntityTag.PROJECT.value:
                    activities_by_project_ref_id[inbox_task.owner.ref_id].append(
                        activity.ref_id
                    )

            for activity in activities:
                if not activity.is_target_project:
                    continue

                if activity.target.ref_id not in target_projects_by_ref_id:
                    activity_doneness[activity.ref_id] = TimePlanActivityDoneness.DONE
                    continue

                project = target_projects_by_ref_id[activity.target.ref_id]

                some_subactivity_is_working_or_done = (
                    any(
                        activity_doneness[a]
                        in (
                            TimePlanActivityDoneness.WORKING,
                            TimePlanActivityDoneness.DONE,
                        )
                        for a in activities_by_project_ref_id[project.ref_id]
                    )
                    if len(activities_by_project_ref_id[project.ref_id]) > 0
                    else False
                )

                all_subactivities_are_done = (
                    all(
                        activity_doneness[a] == TimePlanActivityDoneness.DONE
                        for a in activities_by_project_ref_id[project.ref_id]
                    )
                    if len(activities_by_project_ref_id[project.ref_id]) > 0
                    else False
                )

                if activity.kind == TimePlanActivityKind.FINISH:
                    if project.is_completed:
                        activity_doneness[activity.ref_id] = (
                            TimePlanActivityDoneness.DONE
                        )
                    elif some_subactivity_is_working_or_done:
                        activity_doneness[activity.ref_id] = (
                            TimePlanActivityDoneness.WORKING
                        )
                    else:
                        activity_doneness[activity.ref_id] = (
                            TimePlanActivityDoneness.NOT_DONE
                        )
                elif activity.kind == TimePlanActivityKind.MAKE_PROGRESS:
                    # A tricky business logic decision.
                    # It's quite often the case that we setup a time plan with an inbox
                    # task where we wish to make progress. But the progress we do is just
                    # a bit after the time plan is created. So we'd still wish to show
                    # this as "done" in whatever view we have. So we add a buffer of a
                    # month afterwards to capture this.
                    modified_in_time_plan = (
                        project.is_working_or_more
                        and time_plan.start_date.to_timestamp_at_start_of_day()
                        <= project.last_modified_time
                        and project.last_modified_time
                        <= time_plan.end_date.add_days(60).to_timestamp_at_end_of_day()
                    )

                    if project.is_completed or all_subactivities_are_done:
                        activity_doneness[activity.ref_id] = (
                            TimePlanActivityDoneness.DONE
                        )
                    elif modified_in_time_plan or some_subactivity_is_working_or_done:
                        activity_doneness[activity.ref_id] = (
                            TimePlanActivityDoneness.WORKING
                        )
                    else:
                        activity_doneness[activity.ref_id] = (
                            TimePlanActivityDoneness.NOT_DONE
                        )

        sub_period_time_plans = None
        higher_time_plan = None
        previous_time_plan = None
        if include_other_time_plans:
            sub_period_time_plans = await uow.get(TimePlanRepository).find_all_in_range(
                parent_ref_id=time_plan.time_plan_domain.ref_id,
                allow_archived=False,
                filter_periods=time_plan.period.all_smaller_periods,
                filter_start_date=schedule.first_day,
                filter_end_date=schedule.end_day,
            )

            higher_time_plan = await uow.get(TimePlanRepository).find_higher(
                parent_ref_id=time_plan.time_plan_domain.ref_id,
                allow_archived=False,
                period=time_plan.period,
                right_now=time_plan.right_now,
            )

            previous_time_plan = await uow.get(TimePlanRepository).find_previous(
                parent_ref_id=time_plan.time_plan_domain.ref_id,
                allow_archived=False,
                period=time_plan.period,
                right_now=time_plan.right_now,
            )

        return TimePlanLoadResult(
            time_plan=time_plan,
            tags=tags,
            note=note,
            activities=list(activities),
            chapters=chapters,
            aspects=aspects,
            goals=goals,
            target_inbox_tasks=target_inbox_tasks,
            target_projects=target_projects,
            activity_doneness=activity_doneness,
            completed_nontarget_inbox_tasks=completed_nontarget_inbox_tasks,
            completed_nottarget_projects=completed_nontarget_projects,
            sub_period_time_plans=sub_period_time_plans,
            higher_time_plan=higher_time_plan,
            previous_time_plan=previous_time_plan,
        )
