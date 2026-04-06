"""A smart list collection."""

from typing import TYPE_CHECKING

from jupiter.core.smart_lists.root import SmartList
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    create_entity_action,
    entity,
)

if TYPE_CHECKING:
    from jupiter.core.workspaces.root import Workspace


@entity
class SmartListCollection(TrunkEntity):
    """A smart list collection."""

    workspace: ParentLink["Workspace"]

    smart_lists = ContainsMany(SmartList, smart_list_collection_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_smart_list_collection(
        ctx: DomainContext,
        workspace_ref_id: EntityId,
    ) -> "SmartListCollection":
        """Create a smart list collection."""
        return SmartListCollection._create(
            ctx,
            workspace=ParentLink(workspace_ref_id),
        )
