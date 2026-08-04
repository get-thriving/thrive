"""Update a note use case."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.content_block import OneOfNoteContentBlock
from jupiter.core.common.sub.notes.root import ALLOWED_NOTE_OWNER_TYPES, Note
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterUpdateLeafSupportEntityArgs,
    JupiterUpdateLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class NoteUpdateArgs(JupiterUpdateLeafSupportEntityArgs):
    """NoteUpdate args."""

    ref_id: EntityId
    content: UpdateAction[list[OneOfNoteContentBlock]]


@mutation_use_case(exclude_component=[AppCore.CLI])
class NoteUpdateUseCase(JupiterUpdateLeafSupportEntityUseCase[NoteUpdateArgs, None]):
    """Update a note use case."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: NoteUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        _, note = await self.load_for_owner(
            uow,
            NoteCollection,
            Note,
            args.ref_id,
            context.user.ref_id,
            context.workspace.ref_id,
            ALLOWED_NOTE_OWNER_TYPES,
            AccessLevel.COMMENTER,
        )
        note = note.update(
            ctx=context.domain_context,
            content=args.content,
        )
        note = await uow.get_for(Note).save(note)
