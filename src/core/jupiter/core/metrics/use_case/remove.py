"""The command for hard removing a metric."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.metrics.root import Metric
from jupiter.core.metrics.service.remove import (
    MetricRemoveService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class MetricRemoveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.METRICS)
class MetricRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[MetricRemoveArgs, None]
):
    """The command for removing a metric."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: MetricRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace
        metric = await uow.get_for(Metric).load_by_id(args.ref_id, allow_archived=True)

        await MetricRemoveService().execute(
            context.domain_context, uow, progress_reporter, workspace, metric
        )
