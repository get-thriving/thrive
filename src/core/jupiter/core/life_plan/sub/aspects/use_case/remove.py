"""Use case for removing a aspect."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.aspects.service.reassign_linked_entities import (
    AspectReassignLinkedEntitiesService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_crown_remover import generic_crown_remover


@use_case_args
class AspectRemoveArgs(UseCaseArgsBase):
    """Aspect remove args."""

    ref_id: EntityId
    backup_aspect_ref_id: EntityId | None


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class AspectRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[AspectRemoveArgs, None]
):
    """The command for removing a aspect."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: AspectRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace

        aspect = await uow.get_for(Aspect).load_by_id(args.ref_id)

        if aspect.is_root:
            raise InputValidationError("The root aspect cannot be archived")

        new_aspect = await uow.get_for(Aspect).load_by_id(
            args.backup_aspect_ref_id or aspect.surely_parent_aspect_ref_id
        )

        await AspectReassignLinkedEntitiesService().reassign_linked_entities(
            context.domain_context,
            uow,
            progress_reporter,
            workspace,
            aspect,
            new_aspect,
        )

        await generic_crown_remover(
            context.domain_context, uow, progress_reporter, Aspect, args.ref_id
        )
