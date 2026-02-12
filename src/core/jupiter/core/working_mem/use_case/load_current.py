"""Use case for loading the current working memory file."""

from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.working_mem.collection import (
    WorkingMemCollection,
)
from jupiter.core.working_mem.root import (
    WorkingMem,
    WorkingMemRepository,
)
from jupiter.framework.storage.repository import (
    DomainUnitOfWork,
)
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class WorkingMemLoadCurrentArgs(UseCaseArgsBase):
    """Working mem find args."""


@use_case_result
class WorkingMemLoadCurrentEntry(UseCaseResultBase):
    """Working mem load current entry."""

    working_mem: WorkingMem
    note: Note


@use_case_result
class WorkingMemLoadCurrentResult(UseCaseResultBase):
    """Working mem load current result."""

    entry: WorkingMemLoadCurrentEntry


@readonly_use_case(WorkspaceFeature.WORKING_MEM)
class WorkingMemLoadCurrentUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        WorkingMemLoadCurrentArgs, WorkingMemLoadCurrentResult
    ]
):
    """The command for loading the current working mem."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: WorkingMemLoadCurrentArgs,
    ) -> WorkingMemLoadCurrentResult:
        """Execute the command's action."""
        workspace = context.workspace
        working_mem_collection = await uow.get_for(WorkingMemCollection).load_by_parent(
            workspace.ref_id
        )
        working_mem = await uow.get(WorkingMemRepository).load_the_working_mem(
            working_mem_collection.ref_id
        )
        note = await uow.get(NoteRepository).load_for_source(
            NoteNamespace.WORKING_MEM, working_mem.ref_id, allow_archived=True
        )

        return WorkingMemLoadCurrentResult(
            entry=WorkingMemLoadCurrentEntry(working_mem=working_mem, note=note)
        )
