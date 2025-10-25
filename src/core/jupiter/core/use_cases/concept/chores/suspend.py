"""The command for suspend a chore."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.chores.chore import Chore
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ChoreSuspendArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.CHORES)
class ChoreSuspendUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ChoreSuspendArgs, None]
):
    """The command for suspending a chore."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ChoreSuspendArgs,
    ) -> None:
        """Execute the command's action."""
        chore = await uow.get_for(Chore).load_by_id(args.ref_id)
        chore = chore.suspend(context.domain_context)
        await uow.get_for(Chore).save(chore)
        await progress_reporter.mark_updated(chore)
