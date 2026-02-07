"""Use case for loading the active vision (if any)."""

from jupiter.core.common.sub.notes.domain import NoteDomain
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.visions.root import Vision
from jupiter.core.life_plan.sub.visions.status import VisionStatus
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class VisionLoadActiveArgs(UseCaseArgsBase):
    """VisionLoadActive args."""


@use_case_result
class VisionLoadActiveResult(UseCaseResultBase):
    """VisionLoadActive result."""

    vision: Vision | None
    note: Note | None


@readonly_use_case(WorkspaceFeature.LIFE_PLAN)
class VisionLoadActiveUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        VisionLoadActiveArgs, VisionLoadActiveResult
    ]
):
    """Use case for loading the active vision (if any)."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: VisionLoadActiveArgs,
    ) -> VisionLoadActiveResult:
        """Execute the command's action."""
        life_plan = await uow.get_for(LifePlan).load_by_parent(context.workspace.ref_id)

        visions = await uow.get_for(Vision).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=False,
            status=VisionStatus.ACTIVE,
        )
        if len(visions) == 0:
            return VisionLoadActiveResult(vision=None, note=None)

        vision = visions[0]
        note = await uow.get(NoteRepository).load_for_source(
            NoteDomain.VISION, vision.ref_id, allow_archived=False
        )
        return VisionLoadActiveResult(vision=vision, note=note)
