"""Shared service for archiving an inbox task."""

from jupiter.core.domain.concept.inbox_tasks.inbox_task import InboxTask
from jupiter.core.domain.core.archival_reason import JupiterArchivalReason
from jupiter.core.domain.core.notes.note_domain import NoteDomain
from jupiter.core.domain.core.notes.service.note_archive_service import (
    NoteArchiveService,
)
from jupiter.framework_new.context import MutationContext
from jupiter.framework_new.progress_reporter.reporter import ProgressReporter
from jupiter.framework_new.storage.repository import DomainUnitOfWork


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
