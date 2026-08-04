"""The command for archiving a inbox task."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.root import (
    ALLOWED_INBOX_TASK_OWNER_TYPES,
    InboxTask,
)
from jupiter.core.common.sub.inbox_tasks.service.archive import (
    InboxTaskArchiveService,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterArchiveLeafSupportEntityArgs,
    JupiterArchiveLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class InboxTaskArchiveArgs(JupiterArchiveLeafSupportEntityArgs):
    """PersonFindArgs."""

    ref_id: EntityId


class InboxTaskArchiveUseCase(
    JupiterArchiveLeafSupportEntityUseCase[InboxTaskArchiveArgs, None]
):
    """The command for archiving a inbox task."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: InboxTaskArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        _, inbox_task = await self.load_for_owner(
            uow,
            InboxTaskCollection,
            InboxTask,
            args.ref_id,
            context.user.ref_id,
            context.workspace.ref_id,
            ALLOWED_INBOX_TASK_OWNER_TYPES,
            AccessLevel.WRITER,
        )
        if not inbox_task.can_be_archived_or_removed_independently:
            raise InputValidationError("Cannot archive a linked user inbox task")
        await InboxTaskArchiveService().do_it(
            context.domain_context,
            uow,
            inbox_task,
            JupiterArchivalReason.USER,
        )
