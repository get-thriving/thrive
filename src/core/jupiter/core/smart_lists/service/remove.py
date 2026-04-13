"""Shared service for removing a metric."""

from jupiter.core.common.sub.notes.service.remove import (
    NoteRemoveService,
)
from jupiter.core.common.sub.tags.sub.link.service.remove import TagLinkRemoveService
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.smart_lists.root import SmartList
from jupiter.core.smart_lists.sub.item.root import SmartListItem
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class SmartListRemoveService:
    """Shared service for removing a smart list."""

    async def execute(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        smart_list: SmartList,
    ) -> None:
        """Execute the command's action."""
        tag_link_remove_service = TagLinkRemoveService()
        await tag_link_remove_service.remove_for_entity(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.SMART_LIST.value, smart_list.ref_id),
        )

        all_smart_list_items = await uow.get_for(SmartListItem).find_all(
            smart_list.ref_id,
            allow_archived=True,
        )

        tag_link_remove_service = TagLinkRemoveService()
        note_remove_service = NoteRemoveService()

        for smart_list_item in all_smart_list_items:
            await uow.get_for(SmartListItem).remove(ctx, smart_list_item.ref_id)
            await progress_reporter.mark_removed(smart_list_item)
            await tag_link_remove_service.remove_for_entity(
                ctx,
                uow,
                EntityLink.std(
                    NamedEntityTag.SMART_LIST_ITEM.value, smart_list_item.ref_id
                ),
            )
            await note_remove_service.remove_for_owner(
                ctx,
                uow,
                EntityLink.std(
                    NamedEntityTag.SMART_LIST_ITEM.value, smart_list_item.ref_id
                ),
            )

        await tag_link_remove_service.remove_for_entity(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.SMART_LIST.value, smart_list.ref_id),
        )
        await note_remove_service.remove_for_owner(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.SMART_LIST.value, smart_list.ref_id),
        )

        await uow.get_for(SmartList).remove(ctx, smart_list.ref_id)
        await progress_reporter.mark_removed(smart_list)
