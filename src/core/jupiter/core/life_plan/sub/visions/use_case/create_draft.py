"""Use case for creating (or reusing) the draft vision."""

from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.visions.root import Vision
from jupiter.core.life_plan.sub.visions.status import VisionStatus
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class VisionCreateDraftArgs(JupiterCreateCrownEntityArgs):
    """VisionCreateDraft args."""


@use_case_result
class VisionCreateDraftResult(UseCaseResultBase):
    """VisionCreateDraft result."""

    vision: Vision
    note: Note


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class VisionCreateDraftUseCase(
    JupiterCreateCrownEntityUseCase[VisionCreateDraftArgs, VisionCreateDraftResult]
):
    """Use case for creating (or reusing) the draft vision."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: VisionCreateDraftArgs,
    ) -> VisionCreateDraftResult:
        """Execute the command's action."""
        workspace = context.workspace
        life_plan = await uow.get_for(LifePlan).load_by_parent(workspace.ref_id)

        writable_vision_ref_ids = set(
            await self.find_writable_ref_ids(
                uow, context.user.ref_id, Vision, allow_archived=False
            )
        )

        drafts = await uow.get_for(Vision).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=False,
            status=VisionStatus.DRAFT,
        )
        drafts = [d for d in drafts if d.ref_id in writable_vision_ref_ids]

        if len(drafts) > 0:
            old_draft = drafts[0]
            old_note = await uow.get(NoteRepository).load_for_owner(
                EntityLink.std(NamedEntityTag.VISION.value, old_draft.ref_id),
                allow_archived=False,
            )
            return VisionCreateDraftResult(vision=old_draft, note=old_note)
        else:
            accessible_vision_ref_ids = set(
                await self.find_accessible_ref_ids(
                    uow, context.user.ref_id, Vision, allow_archived=False
                )
            )
            active = await uow.get_for(Vision).find_all_generic(
                parent_ref_id=life_plan.ref_id,
                allow_archived=False,
                status=VisionStatus.ACTIVE,
            )
            active = [a for a in active if a.ref_id in accessible_vision_ref_ids]
            if len(active) > 0:
                active_vision = active[0]
                active_note = await uow.get(NoteRepository).load_for_owner(
                    EntityLink.std(NamedEntityTag.VISION.value, active_vision.ref_id),
                    allow_archived=False,
                )
                content = active_note.content
            else:
                content = []
            draft = Vision.new_draft_vision(
                ctx=context.domain_context,
                life_plan_ref_id=life_plan.ref_id,
            )
            draft = await self.create_entity(
                context.domain_context,
                uow,
                progress_reporter,
                context.user.ref_id,
                draft,
            )

            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id
            )
            note = Note.new_note(
                ctx=context.domain_context,
                note_collection_ref_id=note_collection.ref_id,
                owner=EntityLink.std(NamedEntityTag.VISION.value, draft.ref_id),
                content=content,
            )
            note = await uow.get_for(Note).create(note)
            return VisionCreateDraftResult(vision=draft, note=note)
