"""Remove an occasion."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_crown_remover import generic_crown_remover


@use_case_args
class OccasionRemoveArgs(UseCaseArgsBase):
    """OccasionRemove args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.PRM)
class OccasionRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[OccasionRemoveArgs, None]
):
    """The command for removing an occasion."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: OccasionRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        await generic_crown_remover(
            context.domain_context, uow, progress_reporter, Occasion, args.ref_id
        )

