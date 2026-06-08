"""Use case for loading a metric."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.metrics.root import Metric
from jupiter.core.metrics.service.load import (
    MetricLoadMetricEntryTags,
    MetricLoadResult,
    MetricLoadService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    use_case_args,
)

__all__ = [
    "MetricLoadArgs",
    "MetricLoadMetricEntryTags",
    "MetricLoadResult",
    "MetricLoadUseCase",
]


@use_case_args
class MetricLoadArgs(UseCaseArgsBase):
    """MetricLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None
    allow_archived_entries: bool | None
    collection_task_retrieve_offset: int | None
    include_entry_tags_and_contacts: bool | None = None


@readonly_use_case(WorkspaceFeature.METRICS)
class MetricLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[MetricLoadArgs, MetricLoadResult]
):
    """Use case for loading a metric."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: MetricLoadArgs,
    ) -> MetricLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        allow_archived_entries = args.allow_archived_entries or False
        include_entry_tags_and_contacts = args.include_entry_tags_and_contacts or False

        metric = await uow.get_for(Metric).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )

        return await MetricLoadService().do_it(
            uow,
            context.workspace.ref_id,
            metric,
            allow_archived=allow_archived,
            allow_archived_entries=allow_archived_entries,
            include_entry_tags_and_contacts=include_entry_tags_and_contacts,
            include_collection_tasks=True,
            collection_task_retrieve_offset=args.collection_task_retrieve_offset,
        )
