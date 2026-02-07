"""The command for archiving a metric entry."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.service.archive import (
    NoteArchiveService,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.metrics.sub.entry.root import MetricEntry
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class MetricEntryArchiveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.METRICS)
class MetricEntryArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[MetricEntryArchiveArgs, None]
):
    """The command for archiving a metric entry."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: MetricEntryArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        metric_entry = await uow.get_for(MetricEntry).load_by_id(args.ref_id)
        metric_entry = metric_entry.mark_archived(
            context.domain_context, JupiterArchivalReason.USER
        )
        await uow.get_for(MetricEntry).save(metric_entry)
        await progress_reporter.mark_updated(metric_entry)

        note_archive_service = NoteArchiveService()
        await note_archive_service.archive_for_source(
            context.domain_context,
            uow,
            NoteNamespace.METRIC_ENTRY,
            metric_entry.ref_id,
            JupiterArchivalReason.USER,
        )
