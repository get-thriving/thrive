"""The command for finding a chore."""

from collections import defaultdict

from jupiter.core.chores.collection import ChoreCollection
from jupiter.core.chores.root import Chore
from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.inbox_tasks.source import InboxTaskSource
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
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
from jupiter.framework.base.entity_id import EntityId
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
class ChoreFindArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    allow_archived: bool | None
    include_tags: bool | None
    include_life_plan: bool | None
    include_inbox_tasks: bool | None
    include_notes: bool | None
    filter_ref_ids: list[EntityId] | None
    filter_aspect_ref_ids: list[EntityId] | None


@use_case_result_part
class ChoreFindResultEntry(UseCaseResultBase):
    """A single entry in the load all chores response."""

    chore: Chore
    note: Note | None
    aspect: Aspect | None
    chapter: Chapter | None
    goal: Goal | None
    inbox_tasks: list[InboxTask] | None
    tags: list[Tag]
    contacts: list[Contact]


@use_case_result
class ChoreFindResult(UseCaseResultBase):
    """The result."""

    entries: list[ChoreFindResultEntry]


@readonly_use_case(WorkspaceFeature.CHORES)
class ChoreFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[ChoreFindArgs, ChoreFindResult]
):
    """The command for finding a chore."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ChoreFindArgs,
    ) -> ChoreFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_tags = args.include_tags or False
        include_life_plan = args.include_life_plan or False
        include_inbox_tasks = args.include_inbox_tasks or False
        include_notes = args.include_notes or False
        workspace = context.workspace

        if (
            not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and args.filter_aspect_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)

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
        chore_collection = await uow.get_for(ChoreCollection).load_by_parent(
            workspace.ref_id,
        )

        chores = await uow.get_for(Chore).find_all_generic(
            parent_ref_id=chore_collection.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
            aspect_ref_id=args.filter_aspect_ref_ids or NoFilter(),
        )

        if include_inbox_tasks:
            inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                source=InboxTaskSource.CHORE,
                source_entity_ref_id=[bp.ref_id for bp in chores],
            )
        else:
            inbox_tasks = None

        notes_by_chore_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id
            )
            notes = await uow.get_for(Note).find_all_generic(
                parent_ref_id=note_collection.ref_id,
                namespace=NoteNamespace.CHORE,
                allow_archived=True,
                source_entity_ref_id=[chore.ref_id for chore in chores],
            )
            for note in notes:
                notes_by_chore_ref_id[note.source_entity_ref_id] = note

        if include_tags:
            tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
            all_tags = await uow.get_for(Tag).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                namespace=TagNamespace.CHORE,
            )
            all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                namespace=TagNamespace.CHORE,
                source_entity_ref_id=[c.ref_id for c in chores],
            )
            tag_links_by_chore_ref_id = {t.source_entity_ref_id: t for t in tag_links}
        else:
            all_tags_by_ref_id = {}
            tag_links_by_chore_ref_id = {}

        # Load contacts linked to chores
        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            workspace.ref_id,
        )
        contact_links = await uow.get_for(ContactLink).find_all_generic(
            parent_ref_id=contact_domain.ref_id,
            namespace=ContactNamespace.CHORE,
            allow_archived=False,
            source_entity_ref_id=[c.ref_id for c in chores],
        )
        chore_contacts_by_ref_id = {
            link.source_entity_ref_id: link.contacts_ref_ids for link in contact_links
        }
        all_chore_contact_ref_ids = []
        for contact_ref_ids in chore_contacts_by_ref_id.values():
            all_chore_contact_ref_ids.extend(contact_ref_ids)
        contacts = []
        if all_chore_contact_ref_ids:
            contacts = await uow.get_for(Contact).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=list(set(all_chore_contact_ref_ids)),
            )
        contacts_by_ref_id = {c.ref_id: c for c in contacts}

        return ChoreFindResult(
            entries=[
                ChoreFindResultEntry(
                    chore=rt,
                    chapter=(
                        chapter_by_ref_id[rt.chapter_ref_id]
                        if rt.chapter_ref_id and chapter_by_ref_id is not None
                        else None
                    ),
                    goal=(
                        goal_by_ref_id[rt.goal_ref_id]
                        if rt.goal_ref_id and goal_by_ref_id is not None
                        else None
                    ),
                    aspect=(
                        aspect_by_ref_id[rt.aspect_ref_id]
                        if aspect_by_ref_id is not None
                        else None
                    ),
                    inbox_tasks=(
                        [
                            it
                            for it in inbox_tasks
                            if it.source_entity_ref_id == rt.ref_id
                        ]
                        if inbox_tasks is not None
                        else None
                    ),
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_chore_ref_id[rt.ref_id].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if rt.ref_id in tag_links_by_chore_ref_id
                        else []
                    ),
                    contacts=[
                        contacts_by_ref_id[contact_ref_id]
                        for contact_ref_id in chore_contacts_by_ref_id.get(
                            rt.ref_id, []
                        )
                        if contact_ref_id in contacts_by_ref_id
                    ],
                    note=notes_by_chore_ref_id.get(rt.ref_id, None),
                )
                for rt in chores
            ],
        )
