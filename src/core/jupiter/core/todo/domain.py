"""Todo domain trunk entity."""

from jupiter.core.todo.root import TodoTask
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
class TodoDomain(TrunkEntity):
    """Todo trunk entity."""

    workspace: ParentLink

    tasks = ContainsMany(TodoTask, todo_domain_ref_id=IsRefId())

    @staticmethod
    def new_todo_domain(
        ctx: MutationContext,
        workspace_ref_id: EntityId,
    ) -> "TodoDomain":
        """Create a todo domain."""
        return TodoDomain._create(ctx, workspace=ParentLink(workspace_ref_id))
