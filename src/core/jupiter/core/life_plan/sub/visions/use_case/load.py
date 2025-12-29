"""Use case for loading a particular vision."""

from jupiter.core.common.sub.notes.domain import NoteDomain
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.visions.root import Vision
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class VisionLoadArgs(UseCaseArgsBase):
    """Vision load args."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class VisionLoadResult(UseCaseResultBase):
    """Vision load result."""

    vision: Vision
    note: Note


@readonly_use_case(WorkspaceFeature.LIFE_PLAN)
class VisionLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[VisionLoadArgs, VisionLoadResult]
):
    """Use case for loading a particular vision."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: VisionLoadArgs,
    ) -> VisionLoadResult:
        """Execute the command's action."""
        vision = await uow.get_for(Vision).load_by_id(
            args.ref_id, allow_archived=args.allow_archived
        )

        note = await uow.get(NoteRepository).load_for_source(
            NoteDomain.VISION, vision.ref_id, allow_archived=args.allow_archived
        )

        return VisionLoadResult(vision=vision, note=note)
