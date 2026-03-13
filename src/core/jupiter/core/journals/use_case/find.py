"""Use case for finding journals."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
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

    allow_archived: bool | None
    include_notes: bool | None
    include_journal_stats: bool | None
    include_writing_tasks: bool | None
    include_tags: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result_part
class JournalFindResultEntry(UseCaseResultBase):
    """Result part."""

    journal: Journal
    tags: list[Tag]
    note: Note | None
    journal_stats: JournalStats | None
    writing_task: InboxTask | None


@use_case_result
class JournalFindResult(UseCaseResultBase):
    """Result."""

    entries: list[JournalFindResultEntry]


@readonly_use_case(
    WorkspaceFeature.JOURNALS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
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
        try:
            allow_archived = args.allow_archived or False
            include_notes = args.include_notes or False
            include_journal_stats = args.include_journal_stats or False
            include_writing_tasks = args.include_writing_tasks or False
            include_tags = args.include_tags or False

            workspace = context.workspace

            journal_collection = await uow.get_for(JournalCollection).load_by_parent(
                workspace.ref_id,
            )
            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(
                workspace.ref_id,
            )
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id,
            )
            journals = await uow.get_for(Journal).find_all(
                parent_ref_id=journal_collection.ref_id,
                allow_archived=allow_archived,
                filter_ref_ids=args.filter_ref_ids,
            )

            notes_by_journal_ref_id = {}
            if include_notes:
                notes = await uow.get_for(Note).find_all_generic(
                    parent_ref_id=note_collection.ref_id,
                    namespace=NoteNamespace.JOURNAL,
                    allow_archived=True,
                    source_entity_ref_id=[journal.ref_id for journal in journals],
                )
                for note in notes:
                    notes_by_journal_ref_id[note.source_entity_ref_id] = note

            journal_stats_by_journal_ref_id = {}
            if include_journal_stats:
                journal_stats = await uow.get(JournalStatsRepository).find_all(
                    [journal.ref_id for journal in journals]
                )
                for journal_stat in journal_stats:
                    journal_stats_by_journal_ref_id[journal_stat.journal.ref_id] = (
                        journal_stat
                    )

            writing_tasks_by_journal_ref_id = {}
            if include_writing_tasks:
                writing_tasks = await uow.get_for(InboxTask).find_all_generic(
                    parent_ref_id=inbox_task_collection.ref_id,
                    source=[InboxTaskSource.JOURNAL],
                    allow_archived=allow_archived,
                    source_entity_ref_id=[journal.ref_id for journal in journals],
                )
                for writing_task in writing_tasks:
                    writing_tasks_by_journal_ref_id[
                        writing_task.source_entity_ref_id
                    ] = writing_task

            if include_tags:
                tags_domain = await uow.get_for(TagDomain).load_by_parent(
                    workspace.ref_id
                )
                all_tags = await uow.get_for(Tag).find_all_generic(
                    parent_ref_id=tags_domain.ref_id,
                    allow_archived=False,
                    namespace=TagNamespace.JOURNAL,
                )
                all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
                tag_links = await uow.get(TagLinkRepository).find_all_generic(
                    namespace=TagNamespace.JOURNAL,
                    source_entity_ref_id=[j.ref_id for j in journals],
                )
                tag_links_by_journal_ref_id = {
                    t.source_entity_ref_id: t for t in tag_links
                }
            else:
                all_tags_by_ref_id = {}
                tag_links_by_journal_ref_id = {}

            return JournalFindResult(
                entries=[
                    JournalFindResultEntry(
                        journal=journal,
                        tags=(
                            [
                                all_tags_by_ref_id[rid]
                                for rid in tag_links_by_journal_ref_id[
                                    journal.ref_id
                                ].ref_ids
                                if rid in all_tags_by_ref_id
                            ]
                            if journal.ref_id in tag_links_by_journal_ref_id
                            else []
                        ),
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
        except Exception as e:
            raise Exception("Error finding journals") from e
