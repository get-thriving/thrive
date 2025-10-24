"""A use case for refreshing stats for a big plan."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterLoggedInMutationUseCase,
)
from jupiter.core.domain.application.stats.service.stats_service import StatsService
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.sync_target import SyncTarget
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.progress_reporter.reporter import ProgressReporter
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class BigPlanRefreshStatsArgs(UseCaseArgsBase):
    """The arguments for the big plan refresh stats use case."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanRefreshStatsUseCase(
    JupiterLoggedInMutationUseCase[BigPlanRefreshStatsArgs, None]
):
    """A use case for refreshing stats for a big plan."""

    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: BigPlanRefreshStatsArgs,
    ) -> None:
        """Perform the mutation."""
        stats_service = StatsService(
            domain_storage_engine=self._ports.domain_storage_engine,
        )

        await stats_service.do_it(
            ctx=context.domain_context,
            progress_reporter=progress_reporter,
            user=context.user,
            workspace=context.workspace,
            today=self._time_provider.get_current_date(),
            stats_targets=[SyncTarget.BIG_PLANS],
            filter_big_plan_ref_ids=[args.ref_id],
            filter_habit_ref_ids=None,
            filter_journal_ref_ids=None,
        )
