"""A use case for regenerating tasks associated with metrics."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.gen.service.gen import GenService
from jupiter.core.metrics.root import Metric
from jupiter.core.sync_target import SyncTarget
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class MetricRegenArgs(JupiterUpdateCrownEntityArgs):
    """The arguments for the metric regen use case."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.METRICS)
class MetricRegenUseCase(JupiterUpdateCrownEntityUseCase[MetricRegenArgs, None]):
    """A use case for regenerating tasks associated with metrics."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: MetricRegenArgs,
    ) -> None:
        """Perform the mutation."""
        await self.check_entity(uow, context.user.ref_id, Metric, args.ref_id)

    async def _perform_post_transactional_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: MetricRegenArgs,
        result: None,
    ) -> None:
        """Execute the command's post-mutation work."""
        await GenService(self._ports.domain_storage_engine).do_it(
            ctx=context.domain_context,
            progress_reporter=progress_reporter,
            user=context.user,
            workspace=context.workspace,
            gen_even_if_not_modified=True,
            today=self._time_provider.get_current_date(),
            gen_targets=[SyncTarget.METRICS],
            period=None,
            filter_metric_ref_ids=[args.ref_id],
        )
