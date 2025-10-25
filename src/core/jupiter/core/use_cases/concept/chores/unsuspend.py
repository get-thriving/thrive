"""The command for unsuspending a chore."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.chores.chore import Chore
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.progress_reporter.reporter import ProgressReporter
from jupiter.framework_new.storage.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ChoreUnsuspendArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.CHORES)
class ChoreUnsuspendUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ChoreUnsuspendArgs, None]
):
    """The command for unsuspending a chore."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ChoreUnsuspendArgs,
    ) -> None:
        """Execute the command's action."""
        chore = await uow.get_for(Chore).load_by_id(args.ref_id)
        chore = chore.unsuspend(context.domain_context)
        await uow.get_for(Chore).save(chore)
        await progress_reporter.mark_updated(chore)
