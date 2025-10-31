"""Use case for loading a particular chore."""

from jupiter.core.chores.root import Chore
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domain.concept.projects.project import Project
from jupiter.core.domain.core.notes.note import Note, NoteRepository
from jupiter.core.domain.core.notes.note_domain import NoteDomain
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
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
class ChoreLoadArgs(UseCaseArgsBase):
    """ChoreLoadArgs."""

    ref_id: EntityId
    allow_archived: bool
    inbox_task_retrieve_offset: int | None


@use_case_result
class ChoreLoadResult(UseCaseResultBase):
    """ChoreLoadResult."""

    chore: Chore
    project: Project
    inbox_tasks: list[InboxTask]
    inbox_tasks_total_cnt: int
    inbox_tasks_page_size: int
    note: Note | None


@readonly_use_case(WorkspaceFeature.CHORES)
class ChoreLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[ChoreLoadArgs, ChoreLoadResult]
):
    """Use case for loading a particular chore."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ChoreLoadArgs,
    ) -> ChoreLoadResult:
        """Execute the command's action."""
        if (
            args.inbox_task_retrieve_offset is not None
            and args.inbox_task_retrieve_offset < 0
        ):
            raise InputValidationError("Invalid inbox_task_retrieve_offset")
        workspace = context.workspace
        chore = await uow.get_for(Chore).load_by_id(
            args.ref_id, allow_archived=args.allow_archived
        )
        project = await uow.get_for(Project).load_by_id(chore.project_ref_id)
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )

        inbox_tasks_total_cnt = await uow.get(InboxTaskRepository).count_all_for_source(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=args.allow_archived,
            source=InboxTaskSource.CHORE,
            source_entity_ref_id=chore.ref_id,
        )
        inbox_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=InboxTaskSource.CHORE,
            source_entity_ref_id=chore.ref_id,
            retrieve_offset=args.inbox_task_retrieve_offset or 0,
            retrieve_limit=InboxTaskRepository.PAGE_SIZE,
        )

        note = await uow.get(NoteRepository).load_optional_for_source(
            NoteDomain.CHORE,
            chore.ref_id,
            allow_archived=args.allow_archived,
        )

        return ChoreLoadResult(
            chore=chore,
            project=project,
            inbox_tasks=inbox_tasks,
            inbox_tasks_total_cnt=inbox_tasks_total_cnt,
            inbox_tasks_page_size=InboxTaskRepository.PAGE_SIZE,
            note=note,
        )
