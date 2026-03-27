"""The command for archiving a inbox task."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.inbox_tasks.service.archive import (
    InboxTaskArchiveService,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class InboxTaskArchiveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.TODO_TASK)
class InboxTaskArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[InboxTaskArchiveArgs, None]
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
        inbox_task = await uow.get_for(InboxTask).load_by_id(args.ref_id)
        if not inbox_task.can_be_archived_or_removed_independently:
            raise InputValidationError("Cannot archive a linked user inbox task")
        await InboxTaskArchiveService().do_it(
            context.domain_context,
            uow,
            inbox_task,
            JupiterArchivalReason.USER,
        )
