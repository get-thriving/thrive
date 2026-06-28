"""Use case for archiving a aspect."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterArchiveCrownEntityArgs,
    JupiterArchiveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.aspects.service.reassign_child_aspects import (
    AspectReassignChildAspectsService,
)
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
from jupiter.framework.use_case_io import use_case_args
from jupiter.framework.utils.generic_crown_archiver import generic_crown_archiver


@use_case_args
class AspectArchiveArgs(JupiterArchiveCrownEntityArgs):
    """Aspect archive args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class AspectArchiveUseCase(
    JupiterArchiveCrownEntityUseCase[AspectArchiveArgs, None]
):
    """The command for archiving a aspect."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: AspectArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace
        life_plan = await uow.get_for(LifePlan).load_by_parent(workspace.ref_id)

        aspect = await self.load_entity(uow, context.user.ref_id, Aspect, args.ref_id)

        if aspect.is_root:
            raise InputValidationError("The root aspect cannot be archived")

        new_parent_aspect_ref_id = aspect.surely_parent_aspect_ref_id
        new_aspect = await self.load_entity(
            uow, context.user.ref_id, Aspect, new_parent_aspect_ref_id
        )

        await AspectReassignChildAspectsService().reassign_child_aspects(
            context.domain_context,
            uow,
            progress_reporter,
            life_plan,
            aspect,
        )

        await AspectReassignLinkedEntitiesService().reassign_linked_entities(
            context.domain_context,
            uow,
            progress_reporter,
            workspace,
            aspect,
            new_aspect,
        )

        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            Aspect,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
