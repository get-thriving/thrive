"""A GC log attched to a workspace."""

from jupiter.core.gc.log_entry import GCLogEntry
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    create_entity_action,
    entity,
)


@entity
class GCLog(TrunkEntity):
    """A log of GC actions a user has performed."""

    workspace: ParentLink

    entries = ContainsMany(GCLogEntry, gc_log_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_gc_log(
        ctx: MutationContext,
        workspace_ref_id: EntityId,
    ) -> "GCLog":
        """Create a new GC log."""
        return GCLog._create(ctx, workspace=ParentLink(workspace_ref_id))
