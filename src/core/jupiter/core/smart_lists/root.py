"""A smart list."""

from typing import TYPE_CHECKING

from jupiter.core.common.entity_icon import EntityIcon
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.smart_lists.name import SmartListName
from jupiter.core.smart_lists.sub.item.root import SmartListItem
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    BranchEntity,
    ContainsMany,
    IsRefId,
    OwnsAtMostOne,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.update_action import UpdateAction

if TYPE_CHECKING:
    from jupiter.core.smart_lists.collection import SmartListCollection


@entity
class SmartList(BranchEntity):
    """A smart list."""

    smart_list_collection: ParentLink["SmartListCollection"]
    name: SmartListName
    icon: EntityIcon | None

    items = ContainsMany(SmartListItem, smart_list_ref_id=IsRefId())
    tag_link = OwnsAtMostOne(
        TagLink,
        namespace=TagNamespace.SMART_LIST,
        source_entity_ref_id=IsRefId(),
    )

    note = OwnsAtMostOne(
        Note, namespace=NoteNamespace.SMART_LIST, source_entity_ref_id=IsRefId()
    )

    @staticmethod
    @create_entity_action
    def new_smart_list(
        ctx: DomainContext,
        smart_list_collection_ref_id: EntityId,
        name: SmartListName,
        icon: EntityIcon | None,
    ) -> "SmartList":
        """Create a smart list."""
        return SmartList._create(
            ctx,
            smart_list_collection=ParentLink(smart_list_collection_ref_id),
            name=name,
            icon=icon,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[SmartListName],
        icon: UpdateAction[EntityIcon | None],
    ) -> "SmartList":
        """Change the name of the smart list."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            icon=icon.or_else(self.icon),
        )
