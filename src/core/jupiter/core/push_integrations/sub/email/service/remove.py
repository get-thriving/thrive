"""Service for hard removing a email task and associated inbox task."""

from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.namespace import InboxTaskNamespace
from jupiter.core.common.sub.inbox_tasks.root import InboxTaskRepository
from jupiter.core.common.sub.inbox_tasks.service.remove import (
    InboxTaskRemoveService,
)
from jupiter.core.push_integrations.group import (
    PushIntegrationGroup,
)
from jupiter.core.push_integrations.sub.email.task import EmailTask
from jupiter.core.push_integrations.sub.email.task_collection import (
    EmailTaskCollection,
)
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class EmailTaskRemoveService:
    """Shared service for hard removing a email task."""

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        email_task: EmailTask,
    ) -> None:
        """Execute the service's action."""
        email_task_collection = await uow.get_for(EmailTaskCollection).load_by_id(
            email_task.email_task_collection.ref_id,
        )
        push_integration_group = await uow.get_for(PushIntegrationGroup).load_by_id(
            email_task_collection.push_integration_group.ref_id,
        )
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            push_integration_group.workspace.ref_id,
        )
        inbox_tasks_to_remove = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            namespace=InboxTaskNamespace.EMAIL_TASK,
            source_entity_ref_id=email_task.ref_id,
        )

        inbox_task_remove_service = InboxTaskRemoveService()
        for inbox_task in inbox_tasks_to_remove:
            await inbox_task_remove_service.do_it(
                ctx, uow, progress_reporter, inbox_task
            )

        await uow.get_for(EmailTask).remove(email_task.ref_id)
        await progress_reporter.mark_removed(email_task)
