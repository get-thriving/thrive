"""A task generation log attched to a workspace."""

from typing import TYPE_CHECKING

from jupiter.core.gen.log_entry import GenLogEntry
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
class GenLog(TrunkEntity):
    """A log of task generation actions a user has performed."""

    workspace: ParentLink["Workspace"]

    entries = ContainsMany(GenLogEntry, gen_log_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_gen_log(
        ctx: DomainContext,
        workspace_ref_id: EntityId,
    ) -> "GenLog":
        """Create a new Gen log."""
        return GenLog._create(ctx, workspace=ParentLink(workspace_ref_id))
