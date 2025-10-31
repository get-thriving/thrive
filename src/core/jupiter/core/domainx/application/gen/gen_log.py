"""A task generation log attched to a workspace."""

from jupiter.core.domainx.application.gen.gen_log_entry import GenLogEntry
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
class GenLog(TrunkEntity):
    """A log of task generation actions a user has performed."""

    workspace: ParentLink

    entries = ContainsMany(GenLogEntry, gen_log_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_gen_log(
        ctx: MutationContext,
        workspace_ref_id: EntityId,
    ) -> "GenLog":
        """Create a new Gen log."""
        return GenLog._create(ctx, workspace=ParentLink(workspace_ref_id))
