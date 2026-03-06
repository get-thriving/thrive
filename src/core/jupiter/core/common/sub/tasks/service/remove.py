"""Remove a task."""

from jupiter.core.common.sub.tasks.namespace import TaskNamespace
from jupiter.core.common.sub.tasks.root import Task, TaskRepository
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class TaskRemoveService:
    """A service for removing a task."""

    async def remove(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        task: Task,
    ) -> None:
        """Remove a task."""
        await uow.get_for(Task).remove(task.ref_id)

    async def remove_for_source(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        namespace: TaskNamespace,
        source_entity_ref_id: EntityId,
    ) -> None:
        """Remove a task for a source entity."""
        task = await uow.get(TaskRepository).load_optional_for_source(
            namespace, source_entity_ref_id
        )
        if task is None:
            return
        await uow.get_for(Task).remove(task.ref_id)
