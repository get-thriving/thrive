"""Shared service for archiving an inbox task."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.framework.context import MutationContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class InboxTaskArchiveService:
    """Shared service for archiving an inbox task."""

    async def do_it(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        inbox_task: InboxTask,
        archival_reason: JupiterArchivalReason,
    ) -> None:
        """Execute the service's action."""
        if inbox_task.archived:
            return

        inbox_task = inbox_task.mark_archived(ctx, archival_reason)
        await uow.get_for(InboxTask).save(inbox_task)
