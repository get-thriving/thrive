"""Remove an occasion."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterRemoveCrownEntityArgs,
    JupiterRemoveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args
from jupiter.framework.utils.generic_crown_remover import generic_crown_remover


@use_case_args
class OccasionRemoveArgs(JupiterRemoveCrownEntityArgs):
    """OccasionRemove args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.PRM)
class OccasionRemoveUseCase(JupiterRemoveCrownEntityUseCase[OccasionRemoveArgs, None]):
    """The command for removing an occasion."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: OccasionRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        occasion = await uow.get_for(Occasion).load_by_id(
            args.ref_id, allow_archived=True
        )
        await self.check_entity(
            uow,
            context.user.ref_id,
            Person,
            occasion.person.ref_id,
        )

        await generic_crown_remover(
            context.domain_context, uow, progress_reporter, Occasion, args.ref_id
        )
