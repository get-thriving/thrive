"""The command for archiving a metric."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domainx.core.archival_reason import JupiterArchivalReason
from jupiter.core.domainx.core.notes.note_domain import NoteDomain
from jupiter.core.domainx.core.notes.service.note_archive_service import (
    NoteArchiveService,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import InboxTaskRepository
from jupiter.core.inbox_tasks.service.archive import (
    InboxTaskArchiveService,
)
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.metrics.root import Metric
from jupiter.core.metrics.sub.entry.root import MetricEntry
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class MetricArchiveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.METRICS)
class MetricArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[MetricArchiveArgs, None]
):
    """The command for archiving a metric."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: MetricArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )

        metric = await uow.get_for(Metric).load_by_id(args.ref_id)
        metric_entries_to_archive = await uow.get_for(MetricEntry).find_all(
            parent_ref_id=metric.ref_id,
        )
        inbox_tasks_to_archive = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=False,
            source=InboxTaskSource.METRIC,
            source_entity_ref_id=metric.ref_id,
        )

        inbox_task_archive_service = InboxTaskArchiveService()
        for inbox_task in inbox_tasks_to_archive:
            await inbox_task_archive_service.do_it(
                context.domain_context,
                uow,
                progress_reporter,
                inbox_task,
                JupiterArchivalReason.USER,
            )

        for metric_entry in metric_entries_to_archive:
            metric_entry = metric_entry.mark_archived(
                context.domain_context, JupiterArchivalReason.USER
            )
            await uow.get_for(MetricEntry).save(metric_entry)
            await progress_reporter.mark_updated(metric_entry)

            note_archive_service = NoteArchiveService()
            await note_archive_service.archive_for_source(
                context.domain_context,
                uow,
                NoteDomain.METRIC_ENTRY,
                metric_entry.ref_id,
                JupiterArchivalReason.USER,
            )

        note_archive_service = NoteArchiveService()
        await note_archive_service.archive_for_source(
            context.domain_context,
            uow,
            NoteDomain.METRIC,
            metric.ref_id,
            JupiterArchivalReason.USER,
        )

        metric = metric.mark_archived(
            context.domain_context, JupiterArchivalReason.USER
        )
        await uow.get_for(Metric).save(metric)
        await progress_reporter.mark_updated(metric)
