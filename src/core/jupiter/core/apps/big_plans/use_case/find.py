"""The command for finding a big plan."""

from collections import defaultdict
from typing import cast

from jupiter.core.apps.big_plans.root import BigPlan
from jupiter.core.apps.big_plans.stats import BigPlanStats, BigPlanStatsRepository
from jupiter.core.apps.big_plans.status import BigPlanStatus
from jupiter.core.apps.big_plans.sub.milestones.root import BigPlanMilestone
from jupiter.core.apps.life_plan.sub.aspects.root import Aspect
from jupiter.core.apps.life_plan.sub.chapters.root import Chapter
from jupiter.core.apps.life_plan.sub.goals.root import Goal
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.locations.sub.link.root import LocationLink
from jupiter.core.common.sub.locations.sub.location.root import Location
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
from jupiter.core.features import (
    WorkspaceFeature,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.users.root import UserRepository
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    UnavailableForContextError,
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class BigPlanFindArgs(JupiterFindCrownEntityArgs):
    """PersonFindArgs."""

    allow_archived: bool | None
    include_tags: bool | None
    include_life_plan: bool | None
    include_inbox_tasks: bool | None
    include_notes: bool | None
    include_milestones: bool | None
    include_stats: bool | None
    filter_just_workable: bool | None
    filter_ref_ids: list[EntityId] | None
    filter_aspect_ref_ids: list[EntityId] | None


@use_case_result_part
class BigPlanFindResultEntry(UseCaseResultBase):
    """A single big plan result."""

    big_plan: BigPlan
    note: Note | None
    milestones: list[BigPlanMilestone] | None
    stats: BigPlanStats | None
    aspect: Aspect | None
    chapter: Chapter | None
    goal: Goal | None
    inbox_tasks: list[InboxTask] | None
    tags: list[Tag]
    contacts: list[Contact]
    location: Location | None
    owner: UserLight
    access_status: AccessStatus


@use_case_result
class BigPlanFindResult(UseCaseResultBase):
    """PersonFindResult."""

    entries: list[BigPlanFindResultEntry]


@readonly_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanFindUseCase(
    JupiterFindCrownEntityUseCase[BigPlanFindArgs, BigPlanFindResult]
):
    """The command for finding a big plan."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: BigPlanFindArgs,
    ) -> BigPlanFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_tags = args.include_tags or False
        include_life_plan = args.include_life_plan or False
        include_inbox_tasks = args.include_inbox_tasks or False
        include_notes = args.include_notes or False
        include_milestones = args.include_milestones or False
        include_stats = args.include_stats or False
        workspace = context.workspace

        if (
            not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and args.filter_aspect_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)

        if args.filter_aspect_ref_ids:
            await self.check_entities(
                uow,
                context.user.ref_id,
                Aspect,
                args.filter_aspect_ref_ids,
                allow_archived,
            )

        big_plans = await self.find_all_entities(
            uow,
            context.user.ref_id,
            BigPlan,
            allow_archived=allow_archived,
            filter_ref_ids=args.filter_ref_ids,
        )
        if args.filter_aspect_ref_ids is not None:
            filter_aspect_ref_ids = set(args.filter_aspect_ref_ids)
            big_plans = [
                bp for bp in big_plans if bp.aspect_ref_id in filter_aspect_ref_ids
            ]
        if args.filter_just_workable:
            workable_statuses = set(BigPlanStatus.all_workable_statuses())
            big_plans = [bp for bp in big_plans if bp.status in workable_statuses]
        if not big_plans:
            return BigPlanFindResult(entries=[])

        big_plan_owner_links = [
            EntityLink.std(NamedEntityTag.BIG_PLAN.value, bp.ref_id) for bp in big_plans
        ]

        if include_life_plan:
            aspect_ref_ids = list({bp.aspect_ref_id for bp in big_plans})
            chapter_ref_ids = list(
                {bp.chapter_ref_id for bp in big_plans if bp.chapter_ref_id is not None}
            )
            goal_ref_ids = list(
                {bp.goal_ref_id for bp in big_plans if bp.goal_ref_id is not None}
            )
            aspects = (
                await uow.get_for(Aspect).find_all_generic(
                    allow_archived=allow_archived,
                    ref_id=aspect_ref_ids,
                )
                if aspect_ref_ids
                else []
            )
            aspect_by_ref_id = {it.ref_id: it for it in aspects}
            chapters = (
                await uow.get_for(Chapter).find_all_generic(
                    allow_archived=allow_archived,
                    ref_id=chapter_ref_ids,
                )
                if chapter_ref_ids
                else []
            )
            chapter_by_ref_id = {it.ref_id: it for it in chapters}
            goals = (
                await uow.get_for(Goal).find_all_generic(
                    allow_archived=allow_archived,
                    ref_id=goal_ref_ids,
                )
                if goal_ref_ids
                else []
            )
            goal_by_ref_id = {it.ref_id: it for it in goals}
        else:
            aspect_by_ref_id = None
            chapter_by_ref_id = None
            goal_by_ref_id = None

        if include_stats:
            stats = await uow.get(BigPlanStatsRepository).find_all(
                [bp.ref_id for bp in big_plans]
            )
            stats_by_ref_id = {s.big_plan.ref_id: s for s in stats}
        else:
            stats_by_ref_id = None

        milestones_by_ref_id: dict[EntityId, list[BigPlanMilestone]] | None = None
        if include_milestones:
            milestones = await uow.get_for(BigPlanMilestone).find_all_generic(
                big_plan_ref_id=[bp.ref_id for bp in big_plans],
                allow_archived=False,
            )
            milestones_by_ref_id = defaultdict(list)
            for milestone in milestones:
                milestones_by_ref_id[milestone.big_plan.ref_id].append(milestone)
        else:
            milestones_by_ref_id = None

        if include_inbox_tasks:
            inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                allow_archived=True,
                owner=big_plan_owner_links,
            )
        else:
            inbox_tasks = None

        notes_by_big_plan_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            notes = await uow.get_for(Note).find_all_generic(
                allow_archived=True,
                owner=big_plan_owner_links,
            )
            for note in notes:
                notes_by_big_plan_ref_id[note.owner.ref_id] = note

        if include_tags:
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                allow_archived=False,
                owner=big_plan_owner_links,
            )
            tag_links_by_big_plan_ref_id = {
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
            tag_links_by_big_plan_ref_id = {}

        contact_links = await uow.get_for(ContactLink).find_all_generic(
            allow_archived=False,
            owner=big_plan_owner_links,
        )
        big_plan_contacts_by_ref_id = {
            link.owner.ref_id: link.contacts_ref_ids for link in contact_links
        }
        all_big_plan_contact_ref_ids = []
        for contact_ref_ids in big_plan_contacts_by_ref_id.values():
            all_big_plan_contact_ref_ids.extend(contact_ref_ids)
        contacts = []
        if all_big_plan_contact_ref_ids:
            contacts = await uow.get_for(Contact).find_all_generic(
                allow_archived=False,
                ref_id=list(set(all_big_plan_contact_ref_ids)),
            )
        contacts_by_ref_id = {c.ref_id: c for c in contacts}

        location_links = await uow.get_for(LocationLink).find_all_generic(
            allow_archived=False,
            owner=big_plan_owner_links,
        )
        big_plan_location_ref_id = {
            link.owner.ref_id: location_ref_id
            for link in location_links
            if (location_ref_id := link.location_ref_id) is not None
        }
        all_big_plan_location_ref_ids = list(big_plan_location_ref_id.values())
        locations = []
        if all_big_plan_location_ref_ids:
            locations = await uow.get_for(Location).find_all_generic(
                allow_archived=False,
                ref_id=list(set(all_big_plan_location_ref_ids)),
            )
        locations_by_ref_id = {loc.ref_id: loc for loc in locations}

        owner_ref_ids_by_big_plan_ref_id = (
            await OwnerUserRefIdsForEntitiesService().do_it(
                uow,
                big_plan_owner_links,
            )
        )
        owners = await uow.get(UserRepository).find_all_light_by_ref_ids(
            list(set(owner_ref_ids_by_big_plan_ref_id.values()))
        )
        owners_by_ref_id = {owner.ref_id: owner for owner in owners}

        access_statuses = await uow.get(
            AccessStatusRepository
        ).load_all_for_entities_and_user(big_plan_owner_links, context.user.ref_id)
        access_status_by_big_plan_ref_id = {
            status.entity.ref_id: status for status in access_statuses
        }

        return BigPlanFindResult(
            entries=[
                BigPlanFindResultEntry(
                    big_plan=bp,
                    aspect=(
                        aspect_by_ref_id.get(bp.aspect_ref_id)
                        if aspect_by_ref_id is not None
                        else None
                    ),
                    chapter=(
                        chapter_by_ref_id.get(bp.chapter_ref_id)
                        if bp.chapter_ref_id is not None
                        and chapter_by_ref_id is not None
                        else None
                    ),
                    goal=(
                        goal_by_ref_id.get(bp.goal_ref_id)
                        if bp.goal_ref_id is not None and goal_by_ref_id is not None
                        else None
                    ),
                    milestones=(
                        milestones_by_ref_id[bp.ref_id]
                        if milestones_by_ref_id is not None
                        else None
                    ),
                    stats=(
                        stats_by_ref_id[bp.ref_id]
                        if stats_by_ref_id is not None
                        else None
                    ),
                    inbox_tasks=(
                        [it for it in inbox_tasks if it.owner.ref_id == bp.ref_id]
                        if inbox_tasks is not None
                        else None
                    ),
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_big_plan_ref_id[bp.ref_id].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if bp.ref_id in tag_links_by_big_plan_ref_id
                        else []
                    ),
                    contacts=[
                        contacts_by_ref_id[contact_ref_id]
                        for contact_ref_id in big_plan_contacts_by_ref_id.get(
                            bp.ref_id, []
                        )
                        if contact_ref_id in contacts_by_ref_id
                    ],
                    location=(
                        locations_by_ref_id.get(big_plan_location_ref_id[bp.ref_id])
                        if bp.ref_id in big_plan_location_ref_id
                        else None
                    ),
                    note=notes_by_big_plan_ref_id.get(bp.ref_id, None),
                    owner=owners_by_ref_id[owner_ref_ids_by_big_plan_ref_id[bp.ref_id]],
                    access_status=access_status_by_big_plan_ref_id[bp.ref_id],
                )
                for bp in big_plans
            ],
        )
