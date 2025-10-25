"""Update a note use case."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.app import AppCore
from jupiter.core.domain.core.notes.note import Note
from jupiter.core.domain.core.notes.note_content_block import OneOfNoteContentBlock
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class NoteUpdateArgs(UseCaseArgsBase):
    """NoteUpdate args."""

    ref_id: EntityId
    content: UpdateAction[list[OneOfNoteContentBlock]]


@mutation_use_case(exclude_component=[AppCore.CLI])
class NoteUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[NoteUpdateArgs, None]
):
    """Update a note use case."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: NoteUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        note = await uow.get_for(Note).load_by_id(args.ref_id)
        note = note.update(
            ctx=context.domain_context,
            content=args.content,
        )
        note = await uow.get_for(Note).save(note)
