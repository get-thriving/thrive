"""A chore collection."""

from jupiter.core.chores.root import Chore
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


@entity
class ChoreCollection(TrunkEntity):
    """A chore collection."""

    workspace: ParentLink

    chores = ContainsMany(Chore, chore_collection_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_chore_collection(
        ctx: DomainContext,
        workspace_ref_id: EntityId,
    ) -> "ChoreCollection":
        """Create a chore collection."""
        return ChoreCollection._create(ctx, workspace=ParentLink(workspace_ref_id))
