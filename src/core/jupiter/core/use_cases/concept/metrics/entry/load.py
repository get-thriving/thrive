"""Use case for loading a metric entry."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domain.concept.metrics.metric_entry import MetricEntry
from jupiter.core.domain.core.notes.note import Note, NoteRepository
from jupiter.core.domain.core.notes.note_domain import NoteDomain
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class MetricEntryLoadArgs(UseCaseArgsBase):
    """MetricEntryLoadArgs."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class MetricEntryLoadResult(UseCaseResultBase):
    """MetricEntryLoadResult."""

    metric_entry: MetricEntry
    note: Note | None


@readonly_use_case(WorkspaceFeature.METRICS)
class MetricEntryLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        MetricEntryLoadArgs, MetricEntryLoadResult
    ]
):
    """Use case for loading a metric entry."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: MetricEntryLoadArgs,
    ) -> MetricEntryLoadResult:
        """Execute the command's action."""
        metric_entry = await uow.get_for(MetricEntry).load_by_id(
            args.ref_id, allow_archived=args.allow_archived
        )

        note = await uow.get(NoteRepository).load_optional_for_source(
            NoteDomain.METRIC_ENTRY,
            metric_entry.ref_id,
            allow_archived=args.allow_archived,
        )

        return MetricEntryLoadResult(metric_entry=metric_entry, note=note)
