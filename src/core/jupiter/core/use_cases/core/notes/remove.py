"""The command for removing a note."""

from jupiter.core.app import AppCore
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domainx.core.notes.note import Note
from jupiter.core.domainx.core.notes.service.note_remove_service import (
    NoteRemoveService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class NoteRemoveArgs(UseCaseArgsBase):
    """NoteRemove arguments."""

    ref_id: EntityId


@mutation_use_case(exclude_component=[AppCore.CLI])
class NoteRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[NoteRemoveArgs, None]
):
    """The command for removing a note."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: NoteRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        note = await uow.get_for(Note).load_by_id(args.ref_id)
        await NoteRemoveService().remove(context.domain_context, uow, note)
