"""Shared service for archiving a chore."""

from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.chores.collection import ChoreCollection
from jupiter.core.chores.root import Chore
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.namespace import InboxTaskNamespace
from jupiter.core.common.sub.inbox_tasks.root import InboxTaskRepository
from jupiter.core.common.sub.inbox_tasks.service.archive import (
    InboxTaskArchiveService,
)
from jupiter.core.common.sub.notes.service.archive import (
    NoteArchiveService,
)
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.service.archive import TagLinkArchiveService
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.base.entity_link import EntityLink


class ChoreArchiveService:
    """Shared service for archiving a chore."""

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        chore: Chore,
        archival_reason: JupiterArchivalReason,
    ) -> None:
        """Execute the service's action."""
        if chore.archived:
            return

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
            allow_archived=False,
            namespace=InboxTaskNamespace.CHORE,
            source_entity_ref_id=chore.ref_id,
        )

        inbox_task_archive_service = InboxTaskArchiveService()

        for inbox_task in inbox_tasks_to_archive:
            await inbox_task_archive_service.do_it(
                ctx, uow, inbox_task, archival_reason
            )

        chore = chore.mark_archived(ctx, archival_reason)
        await uow.get_for(Chore).save(chore)
        await progress_reporter.mark_updated(chore)

        note_archive_service = NoteArchiveService()
        await note_archive_service.archive_for_owner(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.CHORE.value, chore.ref_id),
            archival_reason
        )

        tag_link_archive_service = TagLinkArchiveService()
        await tag_link_archive_service.archive_for_entity(
            ctx, uow, TagNamespace.CHORE, chore.ref_id, archival_reason
        )
