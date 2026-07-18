"""Remove a circle."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterRemoveCrownEntityArgs,
    JupiterRemoveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.prm.sub.circle.root import Circle
from jupiter.core.prm.sub.circle.service.remove import CircleRemoveService
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import use_case_args
from jupiter.framework.utils.generic_crown_remover import generic_crown_remover


@use_case_args
class CircleRemoveArgs(JupiterRemoveCrownEntityArgs):
    """Circle remove args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.PRM)
class CircleRemoveUseCase(JupiterRemoveCrownEntityUseCase[CircleRemoveArgs, None]):
    """The command for removing a circle."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: CircleRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        circle = await self.load_entity(uow, context.user.ref_id, Circle, args.ref_id)
        await CircleRemoveService().remove_links(
            context.domain_context, uow, progress_reporter, circle
        )
        await generic_crown_remover(
            context.domain_context, uow, progress_reporter, Circle, args.ref_id
        )
