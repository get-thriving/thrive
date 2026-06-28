"""Use case for loading a metric entry."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.metrics.sub.entry.root import MetricEntry
from jupiter.core.metrics.sub.entry.service.load import (
    MetricEntryLoadResult,
    MetricEntryLoadService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import use_case_args

__all__ = [
    "MetricEntryLoadArgs",
    "MetricEntryLoadResult",
    "MetricEntryLoadUseCase",
]


@use_case_args
class MetricEntryLoadArgs(JupiterLoadCrownEntityArgs):
    """MetricEntryLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@readonly_use_case(WorkspaceFeature.METRICS)
class MetricEntryLoadUseCase(
    JupiterLoadCrownEntityUseCase[MetricEntryLoadArgs, MetricEntryLoadResult]
):
    """Use case for loading a metric entry."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: MetricEntryLoadArgs,
    ) -> MetricEntryLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        await self.check_entity(
            uow,
            context.user.ref_id,
            MetricEntry,
            args.ref_id,
            allow_archived,
        )

        return await MetricEntryLoadService().do_it(
            uow,
            context.workspace.ref_id,
            args.ref_id,
            allow_archived=allow_archived,
        )
