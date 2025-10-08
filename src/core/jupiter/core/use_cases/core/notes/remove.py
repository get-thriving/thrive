"""The command for removing a note."""

from jupiter.core.config import JupiterTransactionalLoggedInMutationUseCase
from jupiter.core.domain.app import AppCore
from jupiter.core.domain.core.notes.note import Note
from jupiter.core.domain.core.notes.service.note_remove_service import (
    NoteRemoveService,
)
from jupiter.core.domain.storage_engine import DomainUnitOfWork
from jupiter.core.use_cases.infra.use_cases import (
    AppLoggedInMutationUseCaseContext,
    mutation_use_case,
)
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.use_case import (
    ProgressReporter,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


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
        context: AppLoggedInMutationUseCaseContext,
        args: NoteRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        note = await uow.get_for(Note).load_by_id(args.ref_id)
        await NoteRemoveService().remove(context.domain_context, uow, note)
