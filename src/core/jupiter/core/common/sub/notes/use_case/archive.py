"""Use case for archiving a note."""

from jupiter.core.app import AppCore
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.notes.service.archive import (
    NoteArchiveService,
)
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
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class NoteArchiveArgs(UseCaseArgsBase):
    """NoteArchive args."""

    ref_id: EntityId


@mutation_use_case(exclude_component=[AppCore.CLI])
class NoteArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[NoteArchiveArgs, None]
):
    """Use case for archiving a note."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: NoteArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        note = await uow.get_for(Note).load_by_id(args.ref_id)
        await NoteArchiveService().archive(
            context.domain_context, uow, note, JupiterArchivalReason.USER
        )
