"""A inbox task collection."""

from jupiter.core.common.sub.inbox_tasks.root import InboxTask
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
class InboxTaskCollection(TrunkEntity):
    """A inbox task collection."""

    workspace: ParentLink

    inbox_tasks = ContainsMany(InboxTask, inbox_task_collection_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_inbox_task_collection(
        ctx: MutationContext,
        workspace_ref_id: EntityId,
    ) -> "InboxTaskCollection":
        """Create a inbox task collection."""
        return InboxTaskCollection._create(ctx, workspace=ParentLink(workspace_ref_id))
