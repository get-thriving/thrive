"""Shared service for removing a metric."""

from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import InboxTaskRepository
from jupiter.core.common.sub.inbox_tasks.service.remove import (
    InboxTaskRemoveService,
)
from jupiter.core.common.sub.notes.service.remove import (
    NoteRemoveService,
)
from jupiter.core.common.sub.tags.sub.link.service.remove import TagLinkRemoveService
from jupiter.core.metrics.root import Metric
from jupiter.core.metrics.sub.entry.root import MetricEntry
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class MetricRemoveService:
    """Shared service for removing a metric."""

    async def execute(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        workspace: Workspace,
        metric: Metric,
    ) -> None:
        """Execute the command's action."""
        all_metric_entries = await uow.get_for(MetricEntry).find_all(
            metric.ref_id,
            allow_archived=True,
        )

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )

        all_inbox_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_owner_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            owner=EntityLink.std(NamedEntityTag.METRIC.value, metric.ref_id),
        )

        inbox_task_remove_service = InboxTaskRemoveService()
        for inbox_task in all_inbox_tasks:
            await inbox_task_remove_service.do_it(
                ctx, uow, progress_reporter, inbox_task
            )

        note_remove_service = NoteRemoveService()
        tag_link_remove_service = TagLinkRemoveService()

        for metric_entry in all_metric_entries:
            await tag_link_remove_service.remove_for_entity(
                ctx,
                uow,
                EntityLink.std(NamedEntityTag.METRIC_ENTRY.value, metric_entry.ref_id),
            )
            await uow.get_for(MetricEntry).remove(ctx, metric_entry.ref_id)
            await progress_reporter.mark_removed(metric_entry)
            await note_remove_service.remove_for_owner(
                ctx,
                uow,
                EntityLink.std(NamedEntityTag.METRIC_ENTRY.value, metric_entry.ref_id),
            )

        await note_remove_service.remove_for_owner(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.METRIC.value, metric.ref_id),
        )
        await tag_link_remove_service.remove_for_entity(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.METRIC.value, metric.ref_id),
        )

        await uow.get_for(Metric).remove(ctx, metric.ref_id)
        await progress_reporter.mark_removed(metric)
