"""Service for hard removing a Slack task and associated inbox task."""

from jupiter.core.domain.concept.push_integrations.group.push_integration_group import (
    PushIntegrationGroup,
)
from jupiter.core.domain.concept.push_integrations.slack.slack_task import SlackTask
from jupiter.core.domain.concept.push_integrations.slack.slack_task_collection import (
    SlackTaskCollection,
)
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import InboxTaskRepository
from jupiter.core.inbox_tasks.service.remove import (
    InboxTaskRemoveService,
)
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.framework.context import MutationContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class SlackTaskRemoveService:
    """Shared service for hard removing a slack task."""

    async def do_it(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        slack_task: SlackTask,
    ) -> None:
        """Execute the service's action."""
        slack_task_collection = await uow.get_for(SlackTaskCollection).load_by_id(
            slack_task.slack_task_collection.ref_id,
        )
        push_integration_group = await uow.get_for(PushIntegrationGroup).load_by_id(
            slack_task_collection.push_integration_group.ref_id,
        )
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            push_integration_group.workspace.ref_id,
        )
        inbox_tasks_to_remove = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=InboxTaskSource.SLACK_TASK,
            source_entity_ref_id=slack_task.ref_id,
        )

        inbox_task_remove_service = InboxTaskRemoveService()
        for inbox_task in inbox_tasks_to_remove:
            await inbox_task_remove_service.do_it(
                ctx, uow, progress_reporter, inbox_task
            )

        await uow.get_for(SlackTask).remove(slack_task.ref_id)
        await progress_reporter.mark_removed(slack_task)
