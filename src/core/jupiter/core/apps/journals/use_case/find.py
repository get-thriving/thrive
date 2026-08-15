"""Use case for finding journals."""

from typing import cast

from jupiter.core.app import AppCore
from jupiter.core.apps.journals.root import Journal
from jupiter.core.apps.journals.stats import (
    JournalStats,
    JournalStatsRepository,
)
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterFindCrownEntityArgs,
    JupiterFindCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.users.root import UserRepository
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class JournalFindArgs(JupiterFindCrownEntityArgs):
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
    owner: UserLight
    access_status: AccessStatus


@use_case_result
class JournalFindResult(UseCaseResultBase):
    """Result."""

    entries: list[JournalFindResultEntry]


@readonly_use_case(
    WorkspaceFeature.JOURNALS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class JournalFindUseCase(
    JupiterFindCrownEntityUseCase[JournalFindArgs, JournalFindResult]
):
    """The command for finding journals."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: JournalFindArgs,
    ) -> JournalFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_notes = args.include_notes or False
        include_journal_stats = args.include_journal_stats or False
        include_writing_tasks = args.include_writing_tasks or False
        include_tags = args.include_tags or False

        journals = await self.find_all_entities(
            uow,
            context.user.ref_id,
            Journal,
            allow_archived=allow_archived,
            filter_ref_ids=args.filter_ref_ids,
        )
        if not journals:
            return JournalFindResult(entries=[])

        journal_owner_links = [
            EntityLink.std(NamedEntityTag.JOURNAL.value, journal.ref_id)
            for journal in journals
        ]

        notes_by_journal_ref_id = {}
        if include_notes:
            notes = await uow.get_for(Note).find_all_generic(
                allow_archived=True,
                owner=journal_owner_links,
            )
            for note in notes:
                notes_by_journal_ref_id[note.owner.ref_id] = note

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
                allow_archived=allow_archived,
                owner=journal_owner_links,
            )
            for writing_task in writing_tasks:
                writing_tasks_by_journal_ref_id[writing_task.owner.ref_id] = (
                    writing_task
                )

        if include_tags:
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                allow_archived=False,
                owner=journal_owner_links,
            )
            tag_links_by_journal_ref_id = {
                cast(EntityId, tl.owner.ref_id): tl for tl in tag_links
            }
            all_tag_ref_ids: list[EntityId] = []
            for tl in tag_links:
                all_tag_ref_ids.extend(tl.ref_ids)
            if all_tag_ref_ids:
                all_tags = await uow.get_for(Tag).find_all_generic(
                    allow_archived=False,
                    ref_id=list(set(all_tag_ref_ids)),
                )
                all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            else:
                all_tags_by_ref_id = {}

        else:
            all_tags_by_ref_id = {}
            tag_links_by_journal_ref_id = {}

        owner_ref_ids_by_journal_ref_id = (
            await OwnerUserRefIdsForEntitiesService().do_it(
                uow,
                journal_owner_links,
            )
        )
        owners = await uow.get(UserRepository).find_all_light_by_ref_ids(
            list(set(owner_ref_ids_by_journal_ref_id.values()))
        )
        owners_by_ref_id = {owner.ref_id: owner for owner in owners}

        access_statuses = await uow.get(
            AccessStatusRepository
        ).load_all_for_entities_and_user(journal_owner_links, context.user.ref_id)
        access_status_by_journal_ref_id = {
            status.entity.ref_id: status for status in access_statuses
        }

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
                    owner=owners_by_ref_id[
                        owner_ref_ids_by_journal_ref_id[journal.ref_id]
                    ],
                    access_status=access_status_by_journal_ref_id[journal.ref_id],
                )
                for journal in journals
            ]
        )
