"""Use case for finding time plans."""

from typing import cast

from jupiter.core.app import AppCore
from jupiter.core.apps.life_plan.sub.aspects.root import Aspect
from jupiter.core.apps.life_plan.sub.chapters.root import Chapter
from jupiter.core.apps.life_plan.sub.goals.root import Goal
from jupiter.core.apps.time_plans.life_plan_links import (
    TimePlanAspectLink,
    TimePlanChapterLink,
    TimePlanGoalLink,
)
from jupiter.core.apps.time_plans.root import TimePlan
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterFindCrownEntityArgs,
    JupiterFindCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.users.root import UserRepository
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class TimePlanFindArgs(JupiterFindCrownEntityArgs):
    """Args."""

    allow_archived: bool | None
    include_notes: bool | None
    include_planning_tasks: bool | None
    include_life_plan_ref_ids: bool | None
    include_tags: bool | None
    filter_ref_ids: list[EntityId] | None = None


@use_case_result_part
class TimePlanFindResultEntry(UseCaseResultBase):
    """Result part."""

    time_plan: TimePlan
    tags: list[Tag]
    note: Note | None
    planning_task: InboxTask | None
    chapter_ref_ids: list[EntityId] | None
    aspect_ref_ids: list[EntityId] | None
    goal_ref_ids: list[EntityId] | None
    owner: UserLight
    access_status: AccessStatus


@use_case_result
class TimePlanFindResult(UseCaseResultBase):
    """Result."""

    entries: list[TimePlanFindResultEntry]


@readonly_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanFindUseCase(
    JupiterFindCrownEntityUseCase[TimePlanFindArgs, TimePlanFindResult]
):
    """The command for finding time plans."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TimePlanFindArgs,
    ) -> TimePlanFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_notes = args.include_notes or False
        include_planning_tasks = args.include_planning_tasks or False
        include_life_plan_ref_ids = args.include_life_plan_ref_ids or False
        include_tags = args.include_tags or False

        workspace = context.workspace

        time_plans = await self.find_all_entities(
            uow,
            context.user.ref_id,
            TimePlan,
            allow_archived=allow_archived,
            filter_ref_ids=args.filter_ref_ids,
        )
        if not time_plans:
            return TimePlanFindResult(entries=[])

        time_plan_owner_links = [
            EntityLink.std(NamedEntityTag.TIME_PLAN.value, time_plan.ref_id)
            for time_plan in time_plans
        ]

        chapter_ref_ids_by_time_plan_ref_id: dict[EntityId, list[EntityId]] = {}
        aspect_ref_ids_by_time_plan_ref_id: dict[EntityId, list[EntityId]] = {}
        goal_ref_ids_by_time_plan_ref_id: dict[EntityId, list[EntityId]] = {}
        if (
            include_life_plan_ref_ids
            and workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and time_plans
        ):
            time_plan_ref_ids = [tp.ref_id for tp in time_plans]
            chapter_links = await uow.get_for_record(TimePlanChapterLink).find_all(
                time_plan_ref_ids
            )
            aspect_links = await uow.get_for_record(TimePlanAspectLink).find_all(
                time_plan_ref_ids
            )
            goal_links = await uow.get_for_record(TimePlanGoalLink).find_all(
                time_plan_ref_ids
            )

            all_chapter_ref_ids = list({link.chapter_ref_id for link in chapter_links})
            all_aspect_ref_ids = list({link.aspect_ref_id for link in aspect_links})
            all_goal_ref_ids = list({link.goal_ref_id for link in goal_links})

            accessible_chapter_ref_ids: set[EntityId] = set()
            if all_chapter_ref_ids:
                accessible_chapter_ref_ids = {
                    chapter.ref_id
                    for chapter in await self.find_all_entities(
                        uow,
                        context.user.ref_id,
                        Chapter,
                        allow_archived=True,
                        filter_ref_ids=all_chapter_ref_ids,
                    )
                }
            accessible_aspect_ref_ids: set[EntityId] = set()
            if all_aspect_ref_ids:
                accessible_aspect_ref_ids = {
                    aspect.ref_id
                    for aspect in await self.find_all_entities(
                        uow,
                        context.user.ref_id,
                        Aspect,
                        allow_archived=True,
                        filter_ref_ids=all_aspect_ref_ids,
                    )
                }
            accessible_goal_ref_ids: set[EntityId] = set()
            if all_goal_ref_ids:
                accessible_goal_ref_ids = {
                    goal.ref_id
                    for goal in await self.find_all_entities(
                        uow,
                        context.user.ref_id,
                        Goal,
                        allow_archived=True,
                        filter_ref_ids=all_goal_ref_ids,
                    )
                }

            for chapter_link in chapter_links:
                if chapter_link.chapter_ref_id not in accessible_chapter_ref_ids:
                    continue
                chapter_ref_ids_by_time_plan_ref_id.setdefault(
                    chapter_link.time_plan.ref_id, []
                ).append(chapter_link.chapter_ref_id)
            for aspect_link in aspect_links:
                if aspect_link.aspect_ref_id not in accessible_aspect_ref_ids:
                    continue
                aspect_ref_ids_by_time_plan_ref_id.setdefault(
                    aspect_link.time_plan.ref_id, []
                ).append(aspect_link.aspect_ref_id)
            for goal_link in goal_links:
                if goal_link.goal_ref_id not in accessible_goal_ref_ids:
                    continue
                goal_ref_ids_by_time_plan_ref_id.setdefault(
                    goal_link.time_plan.ref_id, []
                ).append(goal_link.goal_ref_id)

        notes_by_time_plan_ref_id = {}
        if include_notes:
            notes = await uow.get_for(Note).find_all_generic(
                allow_archived=True,
                owner=time_plan_owner_links,
            )
            for note in notes:
                notes_by_time_plan_ref_id[note.owner.ref_id] = note

        planning_tasks_by_time_plan_ref_id = {}
        if include_planning_tasks:
            planning_tasks = await uow.get_for(InboxTask).find_all_generic(
                allow_archived=allow_archived,
                owner=time_plan_owner_links,
            )
            for planning_task in planning_tasks:
                planning_tasks_by_time_plan_ref_id[planning_task.owner.ref_id] = (
                    planning_task
                )

        if include_tags:
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                allow_archived=False,
                owner=time_plan_owner_links,
            )
            tag_links_by_time_plan_ref_id = {
                cast(EntityId, tl.owner.ref_id): tl for tl in tag_links
            }
            all_tag_ref_ids: list[EntityId] = []
            for tl in tag_links:
                all_tag_ref_ids.extend(tl.ref_ids)
            if all_tag_ref_ids:
                all_tags = await uow.get_for(Tag).find_all_generic(
                    allow_archived=False,
                    ref_id=list(set(all_tag_ref_ids)),
                )
                all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            else:
                all_tags_by_ref_id = {}
        else:
            all_tags_by_ref_id = {}
            tag_links_by_time_plan_ref_id = {}

        owner_ref_ids_by_time_plan_ref_id = (
            await OwnerUserRefIdsForEntitiesService().do_it(
                uow,
                time_plan_owner_links,
            )
        )
        owners = await uow.get(UserRepository).find_all_light_by_ref_ids(
            list(set(owner_ref_ids_by_time_plan_ref_id.values()))
        )
        owners_by_ref_id = {owner.ref_id: owner for owner in owners}

        access_statuses = await uow.get(
            AccessStatusRepository
        ).load_all_for_entities_and_user(time_plan_owner_links, context.user.ref_id)
        access_status_by_time_plan_ref_id = {
            status.entity.ref_id: status for status in access_statuses
        }

        return TimePlanFindResult(
            entries=[
                TimePlanFindResultEntry(
                    time_plan=time_plan,
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_time_plan_ref_id[
                                time_plan.ref_id
                            ].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if time_plan.ref_id in tag_links_by_time_plan_ref_id
                        else []
                    ),
                    note=notes_by_time_plan_ref_id.get(time_plan.ref_id, None),
                    planning_task=planning_tasks_by_time_plan_ref_id.get(
                        time_plan.ref_id, None
                    ),
                    chapter_ref_ids=(
                        chapter_ref_ids_by_time_plan_ref_id.get(time_plan.ref_id, [])
                        if include_life_plan_ref_ids
                        else None
                    ),
                    aspect_ref_ids=(
                        aspect_ref_ids_by_time_plan_ref_id.get(time_plan.ref_id, [])
                        if include_life_plan_ref_ids
                        else None
                    ),
                    goal_ref_ids=(
                        goal_ref_ids_by_time_plan_ref_id.get(time_plan.ref_id, [])
                        if include_life_plan_ref_ids
                        else None
                    ),
                    owner=owners_by_ref_id[
                        owner_ref_ids_by_time_plan_ref_id[time_plan.ref_id]
                    ],
                    access_status=access_status_by_time_plan_ref_id[time_plan.ref_id],
                )
                for time_plan in time_plans
            ]
        )
