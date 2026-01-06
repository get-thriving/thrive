"""Archive a circle."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.prm.sub.circle.root import Circle
from jupiter.core.prm.sub.circle.service.remove import CircleRemoveService
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class CircleArchiveArgs(UseCaseArgsBase):
    """Circle archive args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.PRM)
class CircleArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[CircleArchiveArgs, None]
):
    """The command for archiving a circle."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: CircleArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        circle = await uow.get_for(Circle).load_by_id(args.ref_id, allow_archived=True)
        await CircleRemoveService().remove_links(
            context.domain_context, uow, progress_reporter, circle
        )
        circle = circle.mark_archived(
            context.domain_context, JupiterArchivalReason.USER
        )
        await uow.get_for(Circle).save(circle)
        await progress_reporter.mark_updated(circle)
