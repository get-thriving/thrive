"""A smart list item."""

from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.common.url import URL
from jupiter.core.smart_lists.sub.item.name import (
    SmartListItemName,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    IsRefId,
    LeafEntity,
    OwnsAtMostOne,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.update_action import UpdateAction


@entity
class SmartListItem(LeafEntity):
    """A smart list item."""

    smart_list: ParentLink
    name: SmartListItemName
    is_done: bool
    url: URL | None

    tag_link = OwnsAtMostOne(
        TagLink,
        namespace=TagNamespace.SMART_LIST_ITEM,
        source_entity_ref_id=IsRefId(),
    )
    note = OwnsAtMostOne(
        Note, namespace=NoteNamespace.SMART_LIST_ITEM, source_entity_ref_id=IsRefId()
    )

    @staticmethod
    @create_entity_action
    def new_smart_list_item(
        ctx: MutationContext,
        smart_list_ref_id: EntityId,
        name: SmartListItemName,
        is_done: bool,
        url: URL | None,
    ) -> "SmartListItem":
        """Create a smart list item."""
        return SmartListItem._create(
            ctx,
            smart_list=ParentLink(smart_list_ref_id),
            name=name,
            is_done=is_done,
            url=url,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        name: UpdateAction[SmartListItemName],
        is_done: UpdateAction[bool],
        url: UpdateAction[URL | None],
    ) -> "SmartListItem":
        """Update the smart list item."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            is_done=is_done.or_else(self.is_done),
            url=url.or_else(self.url),
        )
