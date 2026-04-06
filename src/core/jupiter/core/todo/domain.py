"""Todo domain trunk entity."""

from typing import TYPE_CHECKING

from jupiter.core.todo.root import TodoTask
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    entity,
)

if TYPE_CHECKING:
    from jupiter.core.workspaces.root import Workspace


@entity
class TodoDomain(TrunkEntity):
    """Todo trunk entity."""

    workspace: ParentLink["Workspace"]

    tasks = ContainsMany(TodoTask, todo_domain_ref_id=IsRefId())

    @staticmethod
    def new_todo_domain(
        ctx: DomainContext,
        workspace_ref_id: EntityId,
    ) -> "TodoDomain":
        """Create a todo domain."""
        return TodoDomain._create(ctx, workspace=ParentLink(workspace_ref_id))
