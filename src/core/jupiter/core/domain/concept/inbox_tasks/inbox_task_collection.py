"""A inbox task collection."""

from jupiter.core.domain.concept.inbox_tasks.inbox_task import InboxTask
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.context import DomainContext
from jupiter.framework_new.entity import (
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
        ctx: DomainContext,
        workspace_ref_id: EntityId,
    ) -> "InboxTaskCollection":
        """Create a inbox task collection."""
        return InboxTaskCollection._create(ctx, workspace=ParentLink(workspace_ref_id))
