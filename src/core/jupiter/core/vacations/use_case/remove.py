"""The command for removing a vacation entry."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterRemoveCrownEntityArgs,
    JupiterRemoveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.vacations.root import Vacation
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args
from jupiter.framework.utils.generic_crown_remover import generic_crown_remover


@use_case_args
class VacationRemoveArgs(JupiterRemoveCrownEntityArgs):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.VACATIONS)
class VacationRemoveUseCase(
    JupiterRemoveCrownEntityUseCase[VacationRemoveArgs, None]
):
    """The command for removing a vacation."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: VacationRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        await self.check_entity(uow, context.user.ref_id, Vacation, args.ref_id)

        await generic_crown_remover(
            context.domain_context, uow, progress_reporter, Vacation, args.ref_id
        )
