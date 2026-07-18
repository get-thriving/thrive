"""Update a circle."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.prm.sub.circle.name import CircleName
from jupiter.core.prm.sub.circle.root import Circle
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class CircleUpdateArgs(JupiterUpdateCrownEntityArgs):
    """Circle update args."""

    ref_id: EntityId
    name: UpdateAction[CircleName]


@mutation_use_case(WorkspaceFeature.PRM)
class CircleUpdateUseCase(JupiterUpdateCrownEntityUseCase[CircleUpdateArgs, None]):
    """The command for updating a circle."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: CircleUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        circle = await self.load_entity(uow, context.user.ref_id, Circle, args.ref_id)
        circle = circle.update(ctx=context.domain_context, name=args.name)
        await uow.get_for(Circle).save(circle)
        await progress_reporter.mark_updated(circle)
