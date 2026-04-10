"""The command for finding todo tasks."""

from collections import defaultdict

from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.namespace import InboxTaskNamespace
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.todo.domain import TodoDomain
from jupiter.core.todo.root import TodoTask
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    UnavailableForContextError,
    readonly_use_case,
)
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class TodoTaskFindArgs(UseCaseArgsBase):
    """TodoTaskFind args."""

    allow_archived: bool | None
    include_tags: bool | None
    include_contacts: bool | None
    include_notes: bool | None
    include_life_plan: bool | None
    include_inbox_tasks: bool | None
    filter_ref_ids: list[EntityId] | None
    filter_aspect_ref_ids: list[EntityId] | None


@use_case_result_part
class TodoTaskFindResultEntry(UseCaseResultBase):
    """A single entry in the todo task find response."""

    todo_task: TodoTask
    inbox_task: InboxTask | None
    note: Note | None
    aspect: Aspect | None
    chapter: Chapter | None
    goal: Goal | None
    tags: list[Tag]
    contacts: list[Contact]


@use_case_result
class TodoTaskFindResult(UseCaseResultBase):
    """Todo task find result."""

    entries: list[TodoTaskFindResultEntry]


@readonly_use_case(WorkspaceFeature.TODO_TASK)
class TodoTaskFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[TodoTaskFindArgs, TodoTaskFindResult]
):
    """The command for finding todo tasks."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TodoTaskFindArgs,
    ) -> TodoTaskFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_tags = args.include_tags or False
        include_contacts = args.include_contacts or False
        include_notes = args.include_notes or False
        include_life_plan = args.include_life_plan or False
        include_inbox_tasks = args.include_inbox_tasks or False
        workspace = context.workspace

        if (
            not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and args.filter_aspect_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)

        life_plan = await uow.get_for(LifePlan).load_by_parent(workspace.ref_id)

        if include_life_plan:
            aspects = await uow.get_for(Aspect).find_all_generic(
                parent_ref_id=life_plan.ref_id,
                allow_archived=allow_archived,
                ref_id=args.filter_aspect_ref_ids or NoFilter(),
            )
            aspect_by_ref_id = {it.ref_id: it for it in aspects}
            chapters = await uow.get_for(Chapter).find_all_generic(
                parent_ref_id=life_plan.ref_id,
                allow_archived=allow_archived,
                ref_id=NoFilter(),
            )
            chapter_by_ref_id = {it.ref_id: it for it in chapters}
            goals = await uow.get_for(Goal).find_all_generic(
                parent_ref_id=life_plan.ref_id,
                allow_archived=allow_archived,
                ref_id=NoFilter(),
            )
            goal_by_ref_id = {it.ref_id: it for it in goals}
        else:
            aspect_by_ref_id = None
            chapter_by_ref_id = None
            goal_by_ref_id = None

        todo_domain = await uow.get_for(TodoDomain).load_by_parent(workspace.ref_id)
        todo_tasks = await uow.get_for(TodoTask).find_all_generic(
            parent_ref_id=todo_domain.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
            aspect_ref_id=args.filter_aspect_ref_ids or NoFilter(),
        )

        if include_inbox_tasks:
            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(workspace.ref_id)
            inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                namespace=InboxTaskNamespace.TODO_TASK,
                source_entity_ref_id=[todo_task.ref_id for todo_task in todo_tasks],
            )
            inbox_tasks_by_todo_ref_id = {
                it.source_entity_ref_id: it for it in inbox_tasks
            }
        else:
            inbox_tasks_by_todo_ref_id = {}

        notes_by_todo_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id
            )
            notes = await uow.get(NoteRepository).find_all_for_note_collection(
                note_collection_ref_id=note_collection.ref_id,
                allow_archived=True,
                filter_owners=[
                    EntityLink.std(NamedEntityTag.TODO_TASK.value, rid)
                    for rid in [todo_task.ref_id for todo_task in todo_tasks]
                ],
            )
            for note in notes:
                notes_by_todo_ref_id[note.owner.ref_id] = note

        if include_tags:
            tag_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
            all_tags = await uow.get_for(Tag).find_all_generic(
                parent_ref_id=tag_domain.ref_id,
                allow_archived=False,
                namespace=TagNamespace.TODO_TASK,
            )
            all_tags_by_ref_id = {it.ref_id: it for it in all_tags}
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                namespace=TagNamespace.TODO_TASK,
                source_entity_ref_id=[todo_task.ref_id for todo_task in todo_tasks],
            )
            tag_links_by_todo_ref_id = {it.source_entity_ref_id: it for it in tag_links}
        else:
            all_tags_by_ref_id = {}
            tag_links_by_todo_ref_id = {}

        if include_contacts:
            contact_domain = await uow.get_for(ContactDomain).load_by_parent(
                workspace.ref_id
            )
            contact_links = await uow.get_for(ContactLink).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                namespace=ContactNamespace.TODO_TASK,
                allow_archived=False,
                source_entity_ref_id=[todo_task.ref_id for todo_task in todo_tasks],
            )
            todo_contacts_by_ref_id = {
                link.source_entity_ref_id: link.contacts_ref_ids
                for link in contact_links
            }
            all_contact_ref_ids: list[EntityId] = []
            for contact_ref_ids in todo_contacts_by_ref_id.values():
                all_contact_ref_ids.extend(contact_ref_ids)
            if all_contact_ref_ids:
                contacts = await uow.get_for(Contact).find_all_generic(
                    parent_ref_id=contact_domain.ref_id,
                    allow_archived=False,
                    ref_id=list(set(all_contact_ref_ids)),
                )
            else:
                contacts = []
            contacts_by_ref_id = {it.ref_id: it for it in contacts}
        else:
            todo_contacts_by_ref_id = {}
            contacts_by_ref_id = {}

        return TodoTaskFindResult(
            entries=[
                TodoTaskFindResultEntry(
                    todo_task=todo_task,
                    inbox_task=inbox_tasks_by_todo_ref_id.get(todo_task.ref_id, None),
                    note=notes_by_todo_ref_id.get(todo_task.ref_id, None),
                    aspect=(
                        aspect_by_ref_id[todo_task.aspect_ref_id]
                        if aspect_by_ref_id is not None
                        else None
                    ),
                    chapter=(
                        chapter_by_ref_id[todo_task.chapter_ref_id]
                        if todo_task.chapter_ref_id is not None
                        and chapter_by_ref_id is not None
                        else None
                    ),
                    goal=(
                        goal_by_ref_id[todo_task.goal_ref_id]
                        if todo_task.goal_ref_id is not None
                        and goal_by_ref_id is not None
                        else None
                    ),
                    tags=(
                        [
                            all_tags_by_ref_id[tag_ref_id]
                            for tag_ref_id in tag_links_by_todo_ref_id[
                                todo_task.ref_id
                            ].ref_ids
                            if tag_ref_id in all_tags_by_ref_id
                        ]
                        if todo_task.ref_id in tag_links_by_todo_ref_id
                        else []
                    ),
                    contacts=[
                        contacts_by_ref_id[contact_ref_id]
                        for contact_ref_id in todo_contacts_by_ref_id.get(
                            todo_task.ref_id, []
                        )
                        if contact_ref_id in contacts_by_ref_id
                    ],
                )
                for todo_task in todo_tasks
            ]
        )
