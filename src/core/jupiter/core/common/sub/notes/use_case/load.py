"""Use case for loading a note."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class NoteLoadArgs(UseCaseArgsBase):
    """NoteLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class NoteLoadResult(UseCaseResultBase):
    """NoteLoad result."""

    note: Note


@readonly_use_case(exclude_component=[AppCore.CLI])
class NoteLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[NoteLoadArgs, NoteLoadResult]
):
    """Use case for loading a note."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: NoteLoadArgs,
    ) -> NoteLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        note = await uow.get_for(Note).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )
        return NoteLoadResult(note=note)
