"""Use case for loading a smart list."""

from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.smart_lists.root import SmartList
from jupiter.core.smart_lists.sub.item.root import SmartListItem
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
)


@use_case_args
class SmartListLoadArgs(UseCaseArgsBase):
    """SmartListLoadArgs."""

    ref_id: EntityId
    allow_archived: bool
    allow_archived_items: bool
    allow_archived_tags: bool
    include_item_tags_and_notes: bool = False


@use_case_result
class SmartListLoadResult(UseCaseResultBase):
    """SmartListLoadResult."""

    smart_list: SmartList
    tags: list[Tag]
    note: Note | None
    smart_list_items: list[SmartListItem]
    smart_list_item_generic_tags: dict[EntityId, list[Tag]] | None
    smart_list_item_notes: list[Note] | None


@readonly_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[SmartListLoadArgs, SmartListLoadResult]
):
    """Use case for loading a smart list."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: SmartListLoadArgs,
    ) -> SmartListLoadResult:
        """Execute the command's action."""
        smart_list = await uow.get_for(SmartList).load_by_id(
            args.ref_id,
            allow_archived=args.allow_archived,
        )
        tag_link = await uow.get(
            TagLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=TagNamespace.SMART_LIST,
            source_entity_ref_id=smart_list.ref_id,
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []
        smart_list_items = await uow.get_for(SmartListItem).find_all_generic(
            parent_ref_id=smart_list.ref_id, allow_archived=args.allow_archived_items
        )

        note = await uow.get(NoteRepository).load_optional_for_source(
            NoteNamespace.SMART_LIST,
            smart_list.ref_id,
            allow_archived=args.allow_archived,
        )

        smart_list_item_notes: list[Note] | None = None
        smart_list_item_generic_tags: dict[EntityId, list[Tag]] | None = None
        if args.include_item_tags_and_notes and len(smart_list_items) > 0:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                context.workspace.ref_id,
            )
            smart_list_item_notes = await uow.get_for(Note).find_all_generic(
                parent_ref_id=note_collection.ref_id,
                namespace=NoteNamespace.SMART_LIST_ITEM,
                allow_archived=args.allow_archived,
                source_entity_ref_id=[item.ref_id for item in smart_list_items],
            )

            tags_domain = await uow.get_for(TagDomain).load_by_parent(
                context.workspace.ref_id,
            )
            all_item_tags = await uow.get_for(Tag).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                namespace=TagNamespace.SMART_LIST_ITEM,
            )
            all_item_tags_by_ref_id = {t.ref_id: t for t in all_item_tags}
            item_tag_links = await uow.get(TagLinkRepository).find_all_generic(
                namespace=TagNamespace.SMART_LIST_ITEM,
                source_entity_ref_id=[item.ref_id for item in smart_list_items],
            )

            smart_list_item_generic_tags = {
                tl.source_entity_ref_id: [
                    all_item_tags_by_ref_id[rid]
                    for rid in tl.ref_ids
                    if rid in all_item_tags_by_ref_id
                ]
                for tl in item_tag_links
            }

        return SmartListLoadResult(
            smart_list=smart_list,
            tags=tags,
            note=note,
            smart_list_items=smart_list_items,
            smart_list_item_generic_tags=smart_list_item_generic_tags,
            smart_list_item_notes=smart_list_item_notes,
        )
