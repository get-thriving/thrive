"""The command for removing a inbox task."""

from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.inbox_tasks.service.remove import (
    InboxTaskRemoveService,
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
class InboxTaskRemoveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.TODO_TASK)
class InboxTaskRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[InboxTaskRemoveArgs, None]
):
    """The command for removing a inbox task."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: InboxTaskRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        inbox_task = await uow.get_for(InboxTask).load_by_id(
            args.ref_id,
            allow_archived=True,
        )
        if not inbox_task.can_be_archived_or_removed_independently:
            raise InputValidationError("Cannot remove a linked user inbox task")

        await InboxTaskRemoveService().do_it(
            context.domain_context, uow, progress_reporter, inbox_task
        )
