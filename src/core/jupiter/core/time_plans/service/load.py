"""Shared service for loading a time plan and its dependent entities."""

from collections import defaultdict
from typing import cast

from jupiter.core.big_plans.collection import BigPlanCollection
from jupiter.core.big_plans.root import BigPlan, BigPlanRepository
from jupiter.core.common import schedules
from jupiter.core.common.sub.inbox_tasks import parent_link_namespace
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.root import InboxTask, InboxTaskRepository
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.publish.sub.entity.root import (
    PublishEntity,
    PublishEntityRepository,
)
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
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
from jupiter.core.time_plans.root import TimePlan, TimePlanRepository
from jupiter.core.time_plans.sub.activity.doneness import TimePlanActivityDoneness
from jupiter.core.time_plans.sub.activity.kind import TimePlanActivityKind
from jupiter.core.time_plans.sub.activity.root import TimePlanActivity
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import (
    DomainUnitOfWork,
    EntityNotFoundError,
)
from jupiter.framework.use_case_io import UseCaseResultBase, use_case_result


@use_case_result
class TimePlanLoadResult(UseCaseResultBase):
    """TimePlanLoadResult."""

    time_plan: TimePlan
    tags: list[Tag]
    note: Note
    activities: list[TimePlanActivity]
    chapters: list[Chapter]
    aspects: list[Aspect]
    goals: list[Goal]
    target_inbox_tasks: list[InboxTask] | None
    target_big_plans: list[BigPlan] | None
    activity_doneness: dict[EntityId, TimePlanActivityDoneness] | None
    completed_nontarget_inbox_tasks: list[InboxTask] | None
    completed_nottarget_big_plans: list[BigPlan] | None
    sub_period_time_plans: list[TimePlan] | None
    higher_time_plan: TimePlan | None
    previous_time_plan: TimePlan | None
    publish_entity: PublishEntity | None


class TimePlanLoadService:
    """Shared service for loading a time plan and its dependent entities."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        workspace: Workspace,
        time_plan: TimePlan,
        *,
        allow_archived: bool = False,
        include_targets: bool = False,
        include_completed_nontarget: bool = False,
        include_other_time_plans: bool = False,
        include_publish_entity: bool = True,
    ) -> TimePlanLoadResult:
        """Load a time plan together with the entities that hang off it."""
        time_plan = await uow.get_for(TimePlan).load_by_id(
            time_plan.ref_id, allow_archived=allow_archived
        )
        activities = await uow.get_for(TimePlanActivity).find_all(
            parent_ref_id=time_plan.ref_id,
            allow_archived=False,
        )
        notes = await uow.get_for(Note).find_all_generic(
            parent_ref_id=None,
            allow_archived=allow_archived,
            owner=EntityLink.std(NamedEntityTag.TIME_PLAN.value, time_plan.ref_id),
        )
        if not notes:
            raise EntityNotFoundError(
                f"Could not find note for time plan {time_plan.ref_id}"
            )
        note = notes[0]

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
            completed_nontarget_inbox_tasks = await uow.get(
                InboxTaskRepository
            ).find_completed_in_range(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                filter_start_completed_date=schedule.first_day,
                filter_end_completed_date=schedule.end_day,
                filter_include_parent_link_namespaces=[
                    parent_link_namespace.TODO_TASK,
                    parent_link_namespace.BIG_PLAN,
                ],
                filter_exclude_ref_ids=[it.ref_id for it in target_inbox_tasks],
            )

        target_big_plans = None
        completed_nontarget_big_plans = None
        if workspace.is_feature_available(WorkspaceFeature.BIG_PLANS):
            big_plan_collection = await uow.get_for(BigPlanCollection).load_by_parent(
                workspace.ref_id
            )

            if include_targets:
                target_big_plans = await uow.get_for(BigPlan).find_all(
                    parent_ref_id=big_plan_collection.ref_id,
                    allow_archived=True,
                    filter_ref_ids=[
                        a.target.ref_id for a in activities if a.is_target_big_plan
                    ],
                )

            if include_completed_nontarget and target_big_plans is not None:
                completed_nontarget_big_plans = await uow.get(
                    BigPlanRepository
                ).find_completed_in_range(
                    parent_ref_id=big_plan_collection.ref_id,
                    allow_archived=True,
                    filter_start_completed_date=schedule.first_day,
                    filter_end_completed_date=schedule.end_day,
                    filter_exclude_ref_ids=[bp.ref_id for bp in target_big_plans],
                )

        activity_doneness = None
        if include_targets:
            activity_doneness = {}
            target_inbox_tasks_by_ref_id = {
                it.ref_id: it for it in cast(list[InboxTask], target_inbox_tasks)
            }
            target_big_plans_by_ref_id = (
                {bp.ref_id: bp for bp in target_big_plans} if target_big_plans else {}
            )
            activities_by_big_plan_ref_id: defaultdict[EntityId, list[EntityId]] = (
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

                if inbox_task.owner.the_type == NamedEntityTag.BIG_PLAN.value:
                    activities_by_big_plan_ref_id[inbox_task.owner.ref_id].append(
                        activity.ref_id
                    )

            for activity in activities:
                if not activity.is_target_big_plan:
                    continue

                if activity.target.ref_id not in target_big_plans_by_ref_id:
                    activity_doneness[activity.ref_id] = TimePlanActivityDoneness.DONE
                    continue

                big_plan = target_big_plans_by_ref_id[activity.target.ref_id]

                some_subactivity_is_working_or_done = (
                    any(
                        activity_doneness[a]
                        in (
                            TimePlanActivityDoneness.WORKING,
                            TimePlanActivityDoneness.DONE,
                        )
                        for a in activities_by_big_plan_ref_id[big_plan.ref_id]
                    )
                    if len(activities_by_big_plan_ref_id[big_plan.ref_id]) > 0
                    else False
                )

                all_subactivities_are_done = (
                    all(
                        activity_doneness[a] == TimePlanActivityDoneness.DONE
                        for a in activities_by_big_plan_ref_id[big_plan.ref_id]
                    )
                    if len(activities_by_big_plan_ref_id[big_plan.ref_id]) > 0
                    else False
                )

                if activity.kind == TimePlanActivityKind.FINISH:
                    if big_plan.is_completed:
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
                    modified_in_time_plan = (
                        big_plan.is_working_or_more
                        and time_plan.start_date.to_timestamp_at_start_of_day()
                        <= big_plan.last_modified_time
                        and big_plan.last_modified_time
                        <= time_plan.end_date.add_days(60).to_timestamp_at_end_of_day()
                    )

                    if big_plan.is_completed or all_subactivities_are_done:
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

        publish_entity = None
        if include_publish_entity:
            publish_entity = await uow.get(
                PublishEntityRepository
            ).load_optional_for_owner(
                EntityLink.std(NamedEntityTag.TIME_PLAN.value, time_plan.ref_id),
                allow_archived=allow_archived,
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
            target_big_plans=target_big_plans,
            activity_doneness=activity_doneness,
            completed_nontarget_inbox_tasks=completed_nontarget_inbox_tasks,
            completed_nottarget_big_plans=completed_nontarget_big_plans,
            sub_period_time_plans=sub_period_time_plans,
            higher_time_plan=higher_time_plan,
            previous_time_plan=previous_time_plan,
            publish_entity=publish_entity,
        )
