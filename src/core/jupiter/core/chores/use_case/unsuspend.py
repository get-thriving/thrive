"""The command for unsuspending a chore."""

from jupiter.core.chores.root import Chore
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class ChoreUnsuspendArgs(JupiterUpdateCrownEntityArgs):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.CHORES)
class ChoreUnsuspendUseCase(JupiterUpdateCrownEntityUseCase[ChoreUnsuspendArgs, None]):
    """The command for unsuspending a chore."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ChoreUnsuspendArgs,
    ) -> None:
        """Execute the command's action."""
        chore = await self.load_entity(uow, context.user.ref_id, Chore, args.ref_id)
        chore = chore.unsuspend(context.domain_context)
        await uow.get_for(Chore).save(chore)
        await progress_reporter.mark_updated(chore)
