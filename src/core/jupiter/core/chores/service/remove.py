"""Shared service for removing a chore."""

from jupiter.core.chores.collection import ChoreCollection
from jupiter.core.chores.root import Chore
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.namespace import InboxTaskNamespace
from jupiter.core.common.sub.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.service.remove import (
    NoteRemoveService,
)
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.service.remove import TagLinkRemoveService
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class ChoreRemoveService:
    """Shared service for removing a chore."""

    async def remove(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        ref_id: EntityId,
    ) -> None:
        """Hard remove a chore."""
        chore = await uow.get_for(Chore).load_by_id(ref_id, allow_archived=True)
        chore_collection = await uow.get_for(ChoreCollection).load_by_id(
            chore.chore_collection.ref_id,
        )
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            chore_collection.workspace.ref_id,
        )
        inbox_tasks_to_archive = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            namespace=InboxTaskNamespace.CHORE,
            source_entity_ref_id=chore.ref_id,
            allow_archived=True,
        )

        for inbox_task in inbox_tasks_to_archive:
            await uow.get_for(InboxTask).remove(inbox_task.ref_id)

        note_remove_service = NoteRemoveService()
        await note_remove_service.remove_for_source(
            ctx, uow, NoteNamespace.CHORE, chore.ref_id
        )

        tag_link_remove_service = TagLinkRemoveService()
        await tag_link_remove_service.remove_for_entity(
            ctx, uow, TagNamespace.CHORE, chore.ref_id
        )

        chore = await uow.get_for(Chore).remove(ref_id)
        await progress_reporter.mark_removed(chore)
