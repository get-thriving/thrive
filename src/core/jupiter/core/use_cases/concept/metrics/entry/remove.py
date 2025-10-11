"""The command for removing a metric entry."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.metrics.metric_entry import MetricEntry
from jupiter.core.domain.core.notes.note_domain import NoteDomain
from jupiter.core.domain.core.notes.service.note_remove_service import NoteRemoveService
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    ProgressReporter,
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class MetricEntryRemoveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.METRICS)
class MetricEntryRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[MetricEntryRemoveArgs, None]
):
    """The command for removing a metric entry."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: MetricEntryRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        metric_entry = await uow.get_for(MetricEntry).remove(args.ref_id)
        await progress_reporter.mark_removed(metric_entry)
        note_remove_service = NoteRemoveService()
        await note_remove_service.remove_for_source(
            context.domain_context, uow, NoteDomain.METRIC_ENTRY, metric_entry.ref_id
        )
