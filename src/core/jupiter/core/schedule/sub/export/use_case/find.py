"""Usecase for finding schedule exports."""

from collections import defaultdict

from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.features import WorkspaceFeature
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.schedule.sub.export.root import ScheduleExport
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class ScheduleExportFindArgs(UseCaseArgsBase):
    """Args."""

    include_notes: bool | None
    include_tags: bool | None
    allow_archived: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result_part
class ScheduleExportFindResultEntry(UseCaseResultBase):
    """A single entry in the find schedule exports response."""

    schedule_export: ScheduleExport
    tags: list[Tag]
    note: Note | None


@use_case_result
class ScheduleExportFindResult(UseCaseResultBase):
    """The result."""

    entries: list[ScheduleExportFindResultEntry]


@readonly_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleExportFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        ScheduleExportFindArgs, ScheduleExportFindResult
    ]
):
    """Usecase for finding schedule exports."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ScheduleExportFindArgs,
    ) -> ScheduleExportFindResult:
        """Perform the transactional read."""
        include_notes = args.include_notes or False
        include_tags = args.include_tags or False
        allow_archived = args.allow_archived or False

        workspace = context.workspace
        schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
            workspace.ref_id
        )
        schedule_exports = await uow.get_for(ScheduleExport).find_all_generic(
            parent_ref_id=schedule_domain.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
        )

        notes_by_schedule_export_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id
            )
            notes = await uow.get(NoteRepository).find_all_for_note_collection(
                note_collection_ref_id=note_collection.ref_id,
                allow_archived=True,
                filter_owners=[
                    EntityLink.std(NamedEntityTag.SCHEDULE_EXPORT.value, rid)
                    for rid in [se.ref_id for se in schedule_exports]
                ],
            )
            for n in notes:
                notes_by_schedule_export_ref_id[n.owner.ref_id] = n

        if include_tags:
            tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
            all_tags = await uow.get_for(Tag).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                namespace=TagNamespace.SCHEDULE_EXPORT,
            )
            all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                namespace=TagNamespace.SCHEDULE_EXPORT,
                source_entity_ref_id=[se.ref_id for se in schedule_exports],
            )
            tag_links_by_schedule_export_ref_id = {
                t.source_entity_ref_id: t for t in tag_links
            }
        else:
            all_tags_by_ref_id = {}
            tag_links_by_schedule_export_ref_id = {}

        return ScheduleExportFindResult(
            entries=[
                ScheduleExportFindResultEntry(
                    schedule_export=se,
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_schedule_export_ref_id[
                                se.ref_id
                            ].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if se.ref_id in tag_links_by_schedule_export_ref_id
                        else []
                    ),
                    note=notes_by_schedule_export_ref_id.get(se.ref_id, None),
                )
                for se in schedule_exports
            ]
        )
