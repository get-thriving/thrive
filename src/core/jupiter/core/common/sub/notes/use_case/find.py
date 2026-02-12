"""Use case for finding notes."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.framework.base.entity_id import EntityId
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
class NoteFindArgs(UseCaseArgsBase):
    """NoteFind args."""

    allow_archived: bool
    filter_namespace: list[NoteNamespace] | None
    filter_ref_ids: list[EntityId] | None


@use_case_result
class NoteFindResult(UseCaseResultBase):
    """NoteFind result."""

    notes: list[Note]


@readonly_use_case(exclude_component=[AppCore.CLI])
class NoteFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[NoteFindArgs, NoteFindResult]
):
    """Use case for finding notes."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: NoteFindArgs,
    ) -> NoteFindResult:
        """Execute the command's action."""
        workspace = context.workspace
        note_collection = await uow.get_for(NoteCollection).load_by_parent(
            workspace.ref_id
        )

        notes = await uow.get_for(Note).find_all_generic(
            parent_ref_id=note_collection.ref_id,
            allow_archived=args.allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
            namespace=args.filter_namespace or NoFilter(),
        )

        return NoteFindResult(notes=notes)
