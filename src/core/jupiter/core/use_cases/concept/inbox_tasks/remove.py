"""The command for removing a inbox task."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.inbox_tasks.inbox_task import InboxTask
from jupiter.core.domain.concept.inbox_tasks.service.remove_service import (
    InboxTaskRemoveService,
)
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.progress_reporter.reporter import ProgressReporter
from jupiter.framework_new.storage.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class InboxTaskRemoveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.INBOX_TASKS)
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

        await InboxTaskRemoveService().do_it(
            context.domain_context, uow, progress_reporter, inbox_task
        )
