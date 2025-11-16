"""Shared service for archiving an inbox task."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.notes.domain import NoteDomain
from jupiter.core.common.sub.notes.service.archive import (
    NoteArchiveService,
)
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.framework.context import MutationContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class InboxTaskArchiveService:
    """Shared service for archiving an inbox task."""

    async def do_it(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        inbox_task: InboxTask,
        archival_reason: JupiterArchivalReason,
    ) -> None:
        """Execute the service's action."""
        if inbox_task.archived:
            return

        inbox_task = inbox_task.mark_archived(ctx, archival_reason)
        await uow.get_for(InboxTask).save(inbox_task)
        await progress_reporter.mark_updated(inbox_task)

        note_archive_service = NoteArchiveService()
        await note_archive_service.archive_for_source(
            ctx, uow, NoteDomain.INBOX_TASK, inbox_task.ref_id, archival_reason
        )
