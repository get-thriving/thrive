"""The command for finding a big plan."""

from collections import defaultdict
from typing import cast

from jupiter.core.big_plans.collection import BigPlanCollection
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.big_plans.stats import BigPlanStats, BigPlanStatsRepository
from jupiter.core.big_plans.status import BigPlanStatus
from jupiter.core.big_plans.sub.milestones.root import BigPlanMilestone
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import (
    WorkspaceFeature,
)
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    UnavailableForContextError,
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class BigPlanFindArgs(UseCaseArgsBase):
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


@use_case_result
class BigPlanFindResult(UseCaseResultBase):
    """PersonFindResult."""

    entries: list[BigPlanFindResultEntry]


@readonly_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[BigPlanFindArgs, BigPlanFindResult]
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

        filter_status: list[BigPlanStatus] | NoFilter = (
            BigPlanStatus.all_workable_statuses()
            if args.filter_just_workable
            else NoFilter()
        )

        life_plan = await uow.get_for(LifePlan).load_by_parent(
            workspace.ref_id,
        )
        if include_life_plan:
            aspects = await uow.get_for(Aspect).find_all_generic(
                parent_ref_id=life_plan.ref_id,
                allow_archived=allow_archived,
                ref_id=args.filter_aspect_ref_ids or NoFilter(),
            )
            aspect_by_ref_id = {p.ref_id: p for p in aspects}
            chapters = await uow.get_for(Chapter).find_all_generic(
                parent_ref_id=life_plan.ref_id,
                allow_archived=allow_archived,
                ref_id=NoFilter(),
            )
            chapter_by_ref_id = {c.ref_id: c for c in chapters}
            goals = await uow.get_for(Goal).find_all_generic(
                parent_ref_id=life_plan.ref_id,
                allow_archived=allow_archived,
                ref_id=NoFilter(),
            )
            goal_by_ref_id = {g.ref_id: g for g in goals}
        else:
            aspect_by_ref_id = None
            chapter_by_ref_id = None
            goal_by_ref_id = None

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )
        big_plan_collection = await uow.get_for(BigPlanCollection).load_by_parent(
            workspace.ref_id,
        )

        big_plans = await uow.get_for(BigPlan).find_all_generic(
            parent_ref_id=big_plan_collection.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
            status=filter_status,
            aspect_ref_id=args.filter_aspect_ref_ids or NoFilter(),
        )

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
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                owner=[
                    EntityLink.std(NamedEntityTag.BIG_PLAN.value, bp.ref_id)
                    for bp in big_plans
                ],
            )
        else:
            inbox_tasks = None

        notes_by_inbox_task_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id
            )
            notes = await uow.get(NoteRepository).find_all_for_note_collection(
                note_collection_ref_id=note_collection.ref_id,
                allow_archived=True,
                filter_owners=[
                    EntityLink.std(NamedEntityTag.BIG_PLAN.value, rid)
                    for rid in [bp.ref_id for bp in big_plans]
                ],
            )
            for note in notes:
                notes_by_inbox_task_ref_id[note.owner.ref_id] = note

        if include_tags:
            tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                owner=[
                    EntityLink.std(NamedEntityTag.BIG_PLAN.value, bp.ref_id)
                    for bp in big_plans
                ],
            )
            tag_links_by_big_plan_ref_id = {
                cast(EntityId, tl.owner.ref_id): tl for tl in tag_links
            }
            all_tag_ref_ids: list[EntityId] = []
            for tl in tag_links:
                all_tag_ref_ids.extend(tl.ref_ids)
            if all_tag_ref_ids:
                all_tags = await uow.get_for(Tag).find_all_generic(
                    parent_ref_id=tags_domain.ref_id,
                    allow_archived=False,
                    ref_id=list(set(all_tag_ref_ids)),
                )
                all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            else:
                all_tags_by_ref_id = {}
        else:
            all_tags_by_ref_id = {}
            tag_links_by_big_plan_ref_id = {}

        # Load contacts linked to big plans
        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            workspace.ref_id,
        )
        contact_links = await uow.get_for(ContactLink).find_all_generic(
            parent_ref_id=contact_domain.ref_id,
            allow_archived=False,
            owner=[
                EntityLink.std(NamedEntityTag.BIG_PLAN.value, bp.ref_id)
                for bp in big_plans
            ],
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
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=list(set(all_big_plan_contact_ref_ids)),
            )
        contacts_by_ref_id = {c.ref_id: c for c in contacts}

        return BigPlanFindResult(
            entries=[
                BigPlanFindResultEntry(
                    big_plan=bp,
                    aspect=(
                        aspect_by_ref_id[bp.aspect_ref_id]
                        if aspect_by_ref_id is not None
                        else None
                    ),
                    chapter=(
                        chapter_by_ref_id[bp.chapter_ref_id]
                        if bp.chapter_ref_id and chapter_by_ref_id is not None
                        else None
                    ),
                    goal=(
                        goal_by_ref_id[bp.goal_ref_id]
                        if bp.goal_ref_id and goal_by_ref_id is not None
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
                    note=notes_by_inbox_task_ref_id.get(bp.ref_id, None),
                )
                for bp in big_plans
            ],
        )
