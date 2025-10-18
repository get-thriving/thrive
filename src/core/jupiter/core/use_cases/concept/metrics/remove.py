"""The command for hard removing a metric."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.metrics.metric import Metric
from jupiter.core.domain.concept.metrics.service.remove_service import (
    MetricRemoveService,
)
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.progress_reporter import ProgressReporter
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


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
