"""Use case for creating a note."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.content_block import OneOfNoteContentBlock
from jupiter.core.common.sub.notes.domain import NoteDomain
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class NoteCreateArgs(UseCaseArgsBase):
    """NoteCreate args."""

    domain: NoteDomain
    source_entity_ref_id: EntityId
    content: list[OneOfNoteContentBlock]


@use_case_result
class NoteCreateResult(UseCaseResultBase):
    """NoteCreate result."""

    new_note: Note


@mutation_use_case(exclude_component=[AppCore.CLI])
class NoteCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[NoteCreateArgs, NoteCreateResult]
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
        workspace = context.workspace
        note_collection = await uow.get_for(NoteCollection).load_by_parent(
            workspace.ref_id
        )
        note = Note.new_note(
            ctx=context.domain_context,
            note_collection_ref_id=note_collection.ref_id,
            domain=args.domain,
            source_entity_ref_id=args.source_entity_ref_id,
            content=args.content,
        )
        note = await uow.get_for(Note).create(note)
        return NoteCreateResult(new_note=note)
