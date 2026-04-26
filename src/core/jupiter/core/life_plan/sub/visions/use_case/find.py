"""Use case for finding visions."""

from collections import defaultdict

from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.visions.root import Vision
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class VisionFindArgs(UseCaseArgsBase):
    """Vision find args."""

    include_notes: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result
class VisionFindResultEntry(UseCaseResultBase):
    """A single vision result."""

    vision: Vision
    note: Note | None


@use_case_result
class VisionFindResult(UseCaseResultBase):
    """Vision find result."""

    entries: list[VisionFindResultEntry]


@readonly_use_case(WorkspaceFeature.LIFE_PLAN)
class VisionFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[VisionFindArgs, VisionFindResult]
):
    """Use case for finding visions."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: VisionFindArgs,
    ) -> VisionFindResult:
        """Execute the command's action."""
        include_notes = args.include_notes or False

        workspace = context.workspace

        life_plan = await uow.get_for(LifePlan).load_by_parent(workspace.ref_id)

        visions = await uow.get_for(Vision).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=False,
            ref_id=args.filter_ref_ids or NoFilter(),
        )

        notes_by_vision_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes and len(visions) > 0:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id
            )
            notes = await uow.get(NoteRepository).find_all_for_note_collection(
                note_collection_ref_id=note_collection.ref_id,
                allow_archived=True,
                filter_owners=[
                    EntityLink.std(NamedEntityTag.VISION.value, rid)
                    for rid in [v.ref_id for v in visions]
                ],
            )
            for note in notes:
                notes_by_vision_ref_id[note.owner.ref_id] = note

        return VisionFindResult(
            entries=[
                VisionFindResultEntry(
                    vision=vision,
                    note=notes_by_vision_ref_id.get(vision.ref_id, None),
                )
                for vision in visions
            ]
        )
