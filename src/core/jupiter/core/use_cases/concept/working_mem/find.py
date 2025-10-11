"""The command for finding working mem."""

from collections import defaultdict
from typing import cast

from jupiter.core.config import (
    JupiterLoggedInReadonlyUseCaseContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domain.concept.inbox_tasks.inbox_task import InboxTask
from jupiter.core.domain.concept.inbox_tasks.inbox_task_collection import (
    InboxTaskCollection,
)
from jupiter.core.domain.concept.inbox_tasks.inbox_task_source import InboxTaskSource
from jupiter.core.domain.concept.working_mem.working_mem import WorkingMem
from jupiter.core.domain.concept.working_mem.working_mem_collection import (
    WorkingMemCollection,
)
from jupiter.core.domain.core.notes.note import Note
from jupiter.core.domain.core.notes.note_collection import NoteCollection
from jupiter.core.domain.core.notes.note_domain import NoteDomain
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.entity import NoFilter
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    readonly_use_case,
)
from jupiter.framework_new.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class WorkingMemFindArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    allow_archived: bool
    include_notes: bool
    include_cleanup_tasks: bool
    filter_ref_ids: list[EntityId] | None


@use_case_result
class WorkingMemFindResultEntry(UseCaseResultBase):
    """PersonFindResult object."""

    working_mem: WorkingMem
    note: Note | None
    cleanup_task: InboxTask | None


@use_case_result
class WorkingMemFindResult(UseCaseResultBase):
    """PersonFindResult object."""

    entries: list[WorkingMemFindResultEntry]


@readonly_use_case(WorkspaceFeature.WORKING_MEM)
class WorkingMemFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        WorkingMemFindArgs, WorkingMemFindResult
    ]
):
    """The command for finding working mems."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyUseCaseContext,
        args: WorkingMemFindArgs,
    ) -> WorkingMemFindResult:
        """Execute the command's action."""
        workspace = context.workspace

        working_mem_collection = await uow.get_for(WorkingMemCollection).load_by_parent(
            workspace.ref_id,
        )
        working_mems = await uow.get_for(WorkingMem).find_all(
            parent_ref_id=working_mem_collection.ref_id,
            allow_archived=args.allow_archived,
            filter_ref_ids=args.filter_ref_ids,
        )

        notes_by_working_mem_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if args.include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id,
            )
            notes = await uow.get_for(Note).find_all_generic(
                parent_ref_id=note_collection.ref_id,
                domain=NoteDomain.WORKING_MEM,
                allow_archived=True,
                source_entity_ref_id=(
                    [working_mem.ref_id for working_mem in working_mems]
                    if working_mems
                    else NoFilter()
                ),
            )
            for note in notes:
                notes_by_working_mem_ref_id[note.parent_ref_id] = note

        cleanup_tasks_by_working_mem_ref_id: defaultdict[EntityId, InboxTask] = (
            defaultdict(None)
        )

        if args.include_cleanup_tasks:
            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(
                workspace.ref_id,
            )
            cleanup_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                source_entity_ref_id=(
                    [working_mem.ref_id for working_mem in working_mems]
                    if working_mems
                    else NoFilter()
                ),
                source=[InboxTaskSource.WORKING_MEM_CLEANUP],
            )
            for cleanup_task in cleanup_tasks:
                cleanup_tasks_by_working_mem_ref_id[
                    cast(EntityId, cleanup_task.source_entity_ref_id)
                ] = cleanup_task

        return WorkingMemFindResult(
            entries=[
                WorkingMemFindResultEntry(
                    working_mem=working_mem,
                    note=notes_by_working_mem_ref_id.get(working_mem.ref_id, None),
                    cleanup_task=cleanup_tasks_by_working_mem_ref_id.get(
                        working_mem.ref_id, None
                    ),
                )
                for working_mem in working_mems
            ]
        )
