"""Use case for marking a draft vision as active."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.visions.root import Vision
from jupiter.core.life_plan.sub.visions.status import VisionStatus
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class VisionMarkDraftAsActiveArgs(JupiterUpdateCrownEntityArgs):
    """VisionMarkDraftAsActive args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class VisionMarkDraftAsActiveUseCase(
    JupiterUpdateCrownEntityUseCase[VisionMarkDraftAsActiveArgs, None]
):
    """Use case for marking a draft vision as active."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: VisionMarkDraftAsActiveArgs,
    ) -> None:
        """Execute the command's action."""
        life_plan = await uow.get_for(LifePlan).load_by_parent(context.workspace.ref_id)
        draft = await self.load_entity(uow, context.user.ref_id, Vision, args.ref_id)

        if draft.parent_ref_id != life_plan.ref_id:
            raise InputValidationError(
                "The draft vision does not belong to this life plan."
            )
        if draft.status != VisionStatus.DRAFT:
            raise InputValidationError("The vision is not a draft.")

        actives = await uow.get_for(Vision).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=False,
            status=VisionStatus.ACTIVE,
        )
        active = actives[0] if len(actives) > 0 else None

        # Important: update the current active first, otherwise the partial unique index
        # on (life_plan_ref_id) WHERE status='active' could be violated.
        if active is not None:
            active = active.mark_as_old(
                ctx=context.domain_context,
            )
            await uow.get_for(Vision).save(active)
            await progress_reporter.mark_updated(active)

        draft = draft.mark_as_active(
            ctx=context.domain_context,
        )
        await uow.get_for(Vision).save(draft)
        await progress_reporter.mark_updated(draft)
