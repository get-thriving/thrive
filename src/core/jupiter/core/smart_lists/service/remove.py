"""Shared service for removing a metric."""

from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.service.remove import (
    NoteRemoveService,
)
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.service.remove import TagLinkRemoveService
from jupiter.core.smart_lists.root import SmartList
from jupiter.core.smart_lists.sub.item.root import SmartListItem
from jupiter.framework.context import MutationContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class SmartListRemoveService:
    """Shared service for removing a smart list."""

    async def execute(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        smart_list: SmartList,
    ) -> None:
        """Execute the command's action."""
        tag_link_remove_service = TagLinkRemoveService()
        await tag_link_remove_service.remove_for_entity(
            ctx, uow, TagNamespace.SMART_LIST, smart_list.ref_id
        )

        all_smart_list_items = await uow.get_for(SmartListItem).find_all(
            smart_list.ref_id,
            allow_archived=True,
        )

        tag_link_remove_service = TagLinkRemoveService()
        note_remove_service = NoteRemoveService()

        for smart_list_item in all_smart_list_items:
            await uow.get_for(SmartListItem).remove(smart_list_item.ref_id)
            await progress_reporter.mark_removed(smart_list_item)
            await tag_link_remove_service.remove_for_entity(
                ctx, uow, TagNamespace.SMART_LIST_ITEM, smart_list_item.ref_id
            )
            await note_remove_service.remove_for_source(
                ctx, uow, NoteNamespace.SMART_LIST_ITEM, smart_list.ref_id
            )

        await tag_link_remove_service.remove_for_entity(
            ctx, uow, TagNamespace.SMART_LIST, smart_list.ref_id
        )
        await note_remove_service.remove_for_source(
            ctx, uow, NoteNamespace.SMART_LIST, smart_list.ref_id
        )

        await uow.get_for(SmartList).remove(smart_list.ref_id)
        await progress_reporter.mark_removed(smart_list)
