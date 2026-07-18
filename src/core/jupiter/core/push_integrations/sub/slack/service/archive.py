"""Service for archiving a Slack task and associated entities."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.common.sub.inbox_tasks.service.archive import (
    InboxTaskArchiveService,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.push_integrations.group import (
    PushIntegrationGroup,
)
from jupiter.core.push_integrations.sub.slack.task import SlackTask
from jupiter.core.push_integrations.sub.slack.task_collection import (
    SlackTaskCollection,
)
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.value import CompositeValue, value


@value
class SlackTaskArchiveServiceResult(CompositeValue):
    """The result of the archive operation."""

    archived_inbox_tasks: list[InboxTask]


class SlackTaskArchiveService:
    """Shared service for archiving a slack task."""

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        slack_task: SlackTask,
        archival_reason: JupiterArchivalReason,
    ) -> SlackTaskArchiveServiceResult:
        """Execute the service's action.

        Callers must have already authorized write access to the slack task via ACL.
        """
        if slack_task.archived:
            return SlackTaskArchiveServiceResult(archived_inbox_tasks=[])

        slack_task_collection = await uow.get_for(SlackTaskCollection).load_by_id(
            slack_task.slack_task_collection.ref_id,
        )
        push_integration_group = await uow.get_for(PushIntegrationGroup).load_by_id(
            slack_task_collection.push_integration_group.ref_id,
        )
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            push_integration_group.workspace.ref_id,
        )

        inbox_tasks_to_archive = await uow.get(
            InboxTaskRepository
        ).find_all_for_owner_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=False,
            owner=EntityLink.std(NamedEntityTag.SLACK_TASK.value, slack_task.ref_id),
        )

        archived_inbox_taskd = []

        inbox_task_archive_service = InboxTaskArchiveService()
        for inbox_task in inbox_tasks_to_archive:
            await inbox_task_archive_service.do_it(
                ctx, uow, inbox_task, archival_reason
            )
            archived_inbox_taskd.append(inbox_task)

        slack_task = slack_task.mark_archived(ctx, archival_reason)
        await uow.get_for(SlackTask).save(slack_task)
        await progress_reporter.mark_updated(slack_task)

        return SlackTaskArchiveServiceResult(archived_inbox_tasks=archived_inbox_taskd)
