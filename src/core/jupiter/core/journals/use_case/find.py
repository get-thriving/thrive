"""Use case for finding journals."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.journals.collection import JournalCollection
from jupiter.core.journals.root import Journal
from jupiter.core.journals.stats import (
    JournalStats,
    JournalStatsRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class JournalFindArgs(UseCaseArgsBase):
    """Args."""

    allow_archived: bool
    include_notes: bool
    include_journal_stats: bool
    include_writing_tasks: bool
    filter_ref_ids: list[EntityId] | None


@use_case_result_part
class JournalFindResultEntry(UseCaseResultBase):
    """Result part."""

    journal: Journal
    note: Note | None
    journal_stats: JournalStats | None
    writing_task: InboxTask | None


@use_case_result
class JournalFindResult(UseCaseResultBase):
    """Result."""

    entries: list[JournalFindResultEntry]


@readonly_use_case(WorkspaceFeature.JOURNALS, only_for_component=[AppCore.WEBUI])
class JournalFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[JournalFindArgs, JournalFindResult]
):
    """The command for finding journals."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: JournalFindArgs,
    ) -> JournalFindResult:
        """Execute the command's action."""
        workspace = context.workspace

        journal_collection = await uow.get_for(JournalCollection).load_by_parent(
            workspace.ref_id,
        )
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )
        note_collection = await uow.get_for(NoteCollection).load_by_parent(
            workspace.ref_id,
        )
        journals = await uow.get_for(Journal).find_all(
            parent_ref_id=journal_collection.ref_id,
            allow_archived=args.allow_archived,
            filter_ref_ids=args.filter_ref_ids,
        )

        notes_by_journal_ref_id = {}
        if args.include_notes:
            notes = await uow.get_for(Note).find_all_generic(
                parent_ref_id=note_collection.ref_id,
                namespace=NoteNamespace.JOURNAL,
                allow_archived=True,
                source_entity_ref_id=[journal.ref_id for journal in journals],
            )
            for note in notes:
                notes_by_journal_ref_id[note.source_entity_ref_id] = note

        journal_stats_by_journal_ref_id = {}
        if args.include_journal_stats:
            journal_stats = await uow.get(JournalStatsRepository).find_all(
                [journal.ref_id for journal in journals]
            )
            for journal_stat in journal_stats:
                journal_stats_by_journal_ref_id[journal_stat.journal.ref_id] = (
                    journal_stat
                )

        writing_tasks_by_journal_ref_id = {}
        if args.include_writing_tasks:
            writing_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=inbox_task_collection.ref_id,
                source=[InboxTaskSource.JOURNAL],
                allow_archived=args.allow_archived,
                source_entity_ref_id=[journal.ref_id for journal in journals],
            )
            for writing_task in writing_tasks:
                writing_tasks_by_journal_ref_id[writing_task.source_entity_ref_id] = (
                    writing_task
                )

        return JournalFindResult(
            entries=[
                JournalFindResultEntry(
                    journal=journal,
                    note=notes_by_journal_ref_id.get(journal.ref_id, None),
                    journal_stats=journal_stats_by_journal_ref_id.get(
                        journal.ref_id, None
                    ),
                    writing_task=writing_tasks_by_journal_ref_id.get(
                        journal.ref_id, None
                    ),
                )
                for journal in journals
            ]
        )
