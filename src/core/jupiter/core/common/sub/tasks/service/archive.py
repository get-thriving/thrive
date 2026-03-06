"""Shared service for archiving a task."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.tasks.namespace import TaskNamespace
from jupiter.core.common.sub.tasks.root import Task, TaskRepository
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class TaskArchiveService:
    """A service for archiving a task."""

    async def archive(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        task: Task,
        archival_reason: JupiterArchivalReason,
    ) -> None:
        """Archive a task."""
        if task.archived:
            return

        task = task.mark_archived(ctx, archival_reason)
        await uow.get_for(Task).save(task)

    async def archive_for_source(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        namespace: TaskNamespace,
        source_entity_ref_id: EntityId,
        archival_reason: JupiterArchivalReason,
    ) -> None:
        """Archive a task for a source entity."""
        task = await uow.get(TaskRepository).load_optional_for_source(
            namespace, source_entity_ref_id, allow_archived=True
        )

        if task is None:
            return

        if task.archived:
            return

        task = task.mark_archived(ctx, archival_reason)
        await uow.get_for(Task).save(task)
