"""Shared service for loading a todo task and its dependent entities."""

from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.root import InboxTask, InboxTaskRepository
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.publish.sub.entity.root import (
    PublishEntity,
    PublishEntityRepository,
)
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.todo.root import TodoTask
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import UseCaseResultBase, use_case_result


@use_case_result
class TodoTaskLoadResult(UseCaseResultBase):
    """TodoTaskLoadResult."""

    todo_task: TodoTask
    inbox_task: InboxTask
    aspect: Aspect
    chapter: Chapter | None
    goal: Goal | None
    tags: list[Tag]
    contacts: list[Contact]
    note: Note | None
    publish_entity: PublishEntity | None
    time_event_blocks: list[TimeEventInDayBlock]


class TodoTaskLoadService:
    """Shared service for loading a todo task and its dependent entities."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        workspace_ref_id: EntityId,
        todo_task: TodoTask,
        *,
        allow_archived: bool = False,
    ) -> TodoTaskLoadResult:
        """Load a todo task together with the entities that hang off it.

        Callers must have already authorized access to the todo task (via ACL or
        publish). Life-plan crown entities referenced on the todo task are loaded
        below without a separate ACL check.
        """
        # Aspect/chapter/goal are crown entities, but readable because the
        # caller already proved access to the todo task that references them.
        aspect = await uow.get_for(Aspect).load_by_id(todo_task.aspect_ref_id)
        chapter = (
            await uow.get_for(Chapter).load_by_id(todo_task.chapter_ref_id)
            if todo_task.chapter_ref_id
            else None
        )
        goal = (
            await uow.get_for(Goal).load_by_id(todo_task.goal_ref_id)
            if todo_task.goal_ref_id
            else None
        )

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace_ref_id
        )
        linked_inbox_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_owner_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            owner=EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
            allow_archived=allow_archived,
        )
        if len(linked_inbox_tasks) == 0:
            raise InputValidationError(
                f"No inbox task associated with todo task '{todo_task.ref_id}'"
            )
        if len(linked_inbox_tasks) > 1:
            raise InputValidationError(
                f"Multiple inbox tasks associated with todo task '{todo_task.ref_id}'"
            )
        inbox_task = linked_inbox_tasks[0]

        note = await uow.get(NoteRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
            allow_archived=allow_archived,
        )
        publish_entity = await uow.get(PublishEntityRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
            allow_archived=allow_archived,
        )

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []

        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            workspace_ref_id
        )
        contact_link = await uow.get(ContactLinkRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
        )
        if contact_link is not None:
            contacts = await uow.get_for(Contact).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=contact_link.contacts_ref_ids,
            )
        else:
            contacts = []

        time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
            workspace_ref_id
        )
        time_event_blocks = await uow.get_for(TimeEventInDayBlock).find_all_generic(
            parent_ref_id=time_event_domain.ref_id,
            allow_archived=False,
            owner=EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
        )

        return TodoTaskLoadResult(
            todo_task=todo_task,
            inbox_task=inbox_task,
            aspect=aspect,
            chapter=chapter,
            goal=goal,
            tags=tags,
            contacts=contacts,
            note=note,
            publish_entity=publish_entity,
            time_event_blocks=time_event_blocks,
        )
