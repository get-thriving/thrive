"""Use case for loading the active vision (if any)."""

from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterFindCrownEntityArgs,
    JupiterFindCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.visions.root import Vision
from jupiter.core.life_plan.sub.visions.status import VisionStatus
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class VisionLoadActiveArgs(JupiterFindCrownEntityArgs):
    """VisionLoadActive args."""


@use_case_result
class VisionLoadActiveResult(UseCaseResultBase):
    """VisionLoadActive result."""

    vision: Vision | None
    note: Note | None


@readonly_use_case(WorkspaceFeature.LIFE_PLAN)
class VisionLoadActiveUseCase(
    JupiterFindCrownEntityUseCase[VisionLoadActiveArgs, VisionLoadActiveResult]
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

        accessible_vision_ref_ids = set(
            await self.find_accessible_ref_ids(
                uow, context.user.ref_id, Vision, allow_archived=False
            )
        )

        visions = await uow.get_for(Vision).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=False,
            status=VisionStatus.ACTIVE,
        )
        visions = [v for v in visions if v.ref_id in accessible_vision_ref_ids]
        if len(visions) == 0:
            return VisionLoadActiveResult(vision=None, note=None)

        vision = visions[0]
        note = await uow.get(NoteRepository).load_for_owner(
            EntityLink.std(NamedEntityTag.VISION.value, vision.ref_id),
            allow_archived=False,
        )
        return VisionLoadActiveResult(vision=vision, note=note)
