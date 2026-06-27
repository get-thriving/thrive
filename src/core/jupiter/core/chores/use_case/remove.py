"""The command for removing a chore."""

from jupiter.core.chores.root import Chore
from jupiter.core.chores.service.remove import ChoreRemoveService
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterRemoveCrownEntityArgs,
    JupiterRemoveCrownEntityUseCase,
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
class ChoreRemoveArgs(JupiterRemoveCrownEntityArgs):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.CHORES)
class ChoreRemoveUseCase(JupiterRemoveCrownEntityUseCase[ChoreRemoveArgs, None]):
    """The command for removing a chore."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ChoreRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        await self.load_entity(
            uow,
            context.user.ref_id,
            Chore,
            args.ref_id,
        )

        await ChoreRemoveService().remove(
            context.domain_context, uow, progress_reporter, args.ref_id
        )
