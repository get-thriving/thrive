"""Shared service for removing a metric."""

from jupiter.core.common.sub.notes.domain import NoteDomain
from jupiter.core.common.sub.notes.service.remove import (
    NoteRemoveService,
)
from jupiter.core.smart_lists.root import SmartList
from jupiter.core.smart_lists.sub.item.root import SmartListItem
from jupiter.core.smart_lists.sub.tag.root import SmartListTag
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
        all_smart_list_tags = await uow.get_for(SmartListTag).find_all(
            smart_list.ref_id,
            allow_archived=True,
        )
        all_smart_list_items = await uow.get_for(SmartListItem).find_all(
            smart_list.ref_id,
            allow_archived=True,
        )

        for smart_list_tag in all_smart_list_tags:
            await uow.get_for(SmartListTag).remove(smart_list_tag.ref_id)
            await progress_reporter.mark_removed(smart_list_tag)

        note_remove_service = NoteRemoveService()

        for smart_list_item in all_smart_list_items:
            await uow.get_for(SmartListItem).remove(smart_list_item.ref_id)
            await progress_reporter.mark_removed(smart_list_item)
            await note_remove_service.remove_for_source(
                ctx, uow, NoteDomain.SMART_LIST_ITEM, smart_list.ref_id
            )

        await note_remove_service.remove_for_source(
            ctx, uow, NoteDomain.SMART_LIST, smart_list.ref_id
        )

        await uow.get_for(SmartList).remove(smart_list.ref_id)
        await progress_reporter.mark_removed(smart_list)
