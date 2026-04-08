"""Shared service for removing a todo task."""

from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.sub.link.service.remove import (
    ContactLinkRemoveService,
)
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.namespace import InboxTaskNamespace
from jupiter.core.common.sub.inbox_tasks.root import InboxTaskRepository
from jupiter.core.common.sub.inbox_tasks.service.remove import InboxTaskRemoveService
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.service.remove import NoteRemoveService
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.service.remove import TagLinkRemoveService
from jupiter.core.todo.root import TodoTask
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class TodoTaskRemoveService:
    """Shared service for removing a todo task."""

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        todo_task: TodoTask,
    ) -> None:
        """Execute the service's action."""
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            todo_task.todo_domain.ref_id
        )
        linked_inbox_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            namespace=InboxTaskNamespace.TODO_TASK,
            source_entity_ref_id=todo_task.ref_id,
            allow_archived=True,
        )

        inbox_task_remove_service = InboxTaskRemoveService()
        for linked_inbox_task in linked_inbox_tasks:
            await inbox_task_remove_service.do_it(
                ctx, uow, progress_reporter, linked_inbox_task
            )

        note_remove_service = NoteRemoveService()
        await note_remove_service.remove_for_source(
            ctx,
            uow,
            NoteNamespace.TODO_TASK,
            todo_task.ref_id,
            root_is_removed=True,
        )

        tag_link_remove_service = TagLinkRemoveService()
        await tag_link_remove_service.remove_for_entity(
            ctx, uow, TagNamespace.TODO_TASK, todo_task.ref_id
        )

        contact_link_remove_service = ContactLinkRemoveService()
        await contact_link_remove_service.remove_for_entity(
            ctx, uow, ContactNamespace.TODO_TASK, todo_task.ref_id
        )

        removed_todo_task = await uow.get_for(TodoTask).remove(todo_task.ref_id)
        await progress_reporter.mark_removed(removed_todo_task)
