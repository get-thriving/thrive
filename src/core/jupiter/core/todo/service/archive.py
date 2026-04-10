"""Shared service for archiving a todo task."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.contacts.sub.link.service.archive import (
    ContactLinkArchiveService,
)
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.namespace import InboxTaskNamespace
from jupiter.core.common.sub.inbox_tasks.root import InboxTaskRepository
from jupiter.core.common.sub.inbox_tasks.service.archive import InboxTaskArchiveService
from jupiter.core.common.sub.notes.service.archive import NoteArchiveService
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.service.archive import TagLinkArchiveService
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.todo.root import TodoTask
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class TodoTaskArchiveService:
    """Shared service for archiving a todo task."""

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        todo_task: TodoTask,
        archival_reason: JupiterArchivalReason,
    ) -> TodoTask:
        """Execute the service's action."""
        if todo_task.archived:
            return todo_task

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

        inbox_task_archive_service = InboxTaskArchiveService()
        for linked_inbox_task in linked_inbox_tasks:
            await inbox_task_archive_service.do_it(
                ctx,
                uow,
                linked_inbox_task,
                archival_reason,
            )

        todo_task = todo_task.mark_archived(ctx, archival_reason)
        todo_task = await uow.get_for(TodoTask).save(todo_task)
        await progress_reporter.mark_updated(todo_task)

        note_archive_service = NoteArchiveService()
        await note_archive_service.archive_for_owner(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
            archival_reason,
        )

        tag_link_archive_service = TagLinkArchiveService()
        await tag_link_archive_service.archive_for_entity(
            ctx,
            uow,
            TagNamespace.TODO_TASK,
            todo_task.ref_id,
            archival_reason,
        )

        contact_link_archive_service = ContactLinkArchiveService()
        await contact_link_archive_service.archive_for_entity(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
            archival_reason,
        )

        return todo_task
