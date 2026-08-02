"""Use case for creating a note."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.content_block import OneOfNoteContentBlock
from jupiter.core.common.sub.notes.root import ALLOWED_NOTE_OWNER_TYPES, Note
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterCreateLeafSupportEntityArgs,
    JupiterCreateLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class NoteCreateArgs(JupiterCreateLeafSupportEntityArgs):
    """NoteCreate args."""

    owner: EntityLink
    content: list[OneOfNoteContentBlock]


@use_case_result
class NoteCreateResult(UseCaseResultBase):
    """NoteCreate result."""

    new_note: Note


@mutation_use_case(exclude_component=[AppCore.CLI])
class NoteCreateUseCase(
    JupiterCreateLeafSupportEntityUseCase[NoteCreateArgs, NoteCreateResult]
):
    """Use case for creating a note."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: NoteCreateArgs,
    ) -> NoteCreateResult:
        """Execute the command's action."""
        # Commenting is the lowest level that may add a note, so a reader the
        # entity was shared with cannot, while its owner and writers can. The
        # note itself belongs with that entity, so it is filed in the owner's
        # workspace rather than the caller's.
        owner_workspace_ref_id = await self.check_owner_and_find_workspace(
            uow,
            context.user.ref_id,
            context.workspace.ref_id,
            args.owner,
            ALLOWED_NOTE_OWNER_TYPES,
            AccessLevel.COMMENTER,
        )
        note_collection = await self.load_parent(
            uow, NoteCollection, owner_workspace_ref_id
        )
        note = Note.new_note(
            ctx=context.domain_context,
            note_collection_ref_id=note_collection.ref_id,
            owner=args.owner,
            content=args.content,
        )
        note = await uow.get_for(Note).create(note)
        return NoteCreateResult(new_note=note)
