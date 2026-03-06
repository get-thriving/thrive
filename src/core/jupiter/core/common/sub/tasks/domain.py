"""Tasks domain trunk entity."""

from jupiter.core.common.sub.tasks.root import Task
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    entity,
)


@entity
class TaskDomain(TrunkEntity):
    """Tasks trunk entity."""

    workspace: ParentLink

    tasks = ContainsMany(Task, task_domain_ref_id=IsRefId())

    @staticmethod
    def new_task_domain(
        ctx: MutationContext,
        workspace_ref_id: EntityId,
    ) -> "TaskDomain":
        """Create a tasks domain."""
        return TaskDomain._create(ctx, workspace=ParentLink(workspace_ref_id))
