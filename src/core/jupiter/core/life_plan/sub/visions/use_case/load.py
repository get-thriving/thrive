"""Use case for loading a particular vision."""

from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.visions.root import Vision
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class VisionLoadArgs(JupiterLoadCrownEntityArgs):
    """Vision load args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class VisionLoadResult(UseCaseResultBase):
    """Vision load result."""

    vision: Vision
    note: Note


@readonly_use_case(WorkspaceFeature.LIFE_PLAN)
class VisionLoadUseCase(
    JupiterLoadCrownEntityUseCase[VisionLoadArgs, VisionLoadResult]
):
    """Use case for loading a particular vision."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: VisionLoadArgs,
    ) -> VisionLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        vision = await self.load_entity(
            uow,
            context.user.ref_id,
            Vision,
            args.ref_id,
            allow_archived,
        )

        note = await uow.get(NoteRepository).load_for_owner(
            EntityLink.std(NamedEntityTag.VISION.value, vision.ref_id),
            allow_archived=allow_archived,
        )

        return VisionLoadResult(vision=vision, note=note)
