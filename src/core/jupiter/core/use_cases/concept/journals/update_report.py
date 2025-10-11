"""Use case for refreshing stats for a journal."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCase,
    JupiterLoggedInMutationUseCaseContext,
)
from jupiter.core.domain.application.stats.service.stats_service import StatsService
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.sync_target import SyncTarget
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.use_case import (
    ProgressReporter,
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class JournalRefreshStatsArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.JOURNALS)
class JournalRefreshStatsUseCase(
    JupiterLoggedInMutationUseCase[JournalRefreshStatsArgs, None]
):
    """Use case for refreshing stats for a journal."""

    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: JournalRefreshStatsArgs,
    ) -> None:
        """Execute the command's action."""
        stats_service = StatsService(self._ports.domain_storage_engine)

        await stats_service.do_it(
            ctx=context.domain_context,
            progress_reporter=progress_reporter,
            user=context.user,
            workspace=context.workspace,
            today=self._time_provider.get_current_date(),
            stats_targets=[SyncTarget.JOURNALS],
            filter_journal_ref_ids=[args.ref_id],
            filter_habit_ref_ids=None,
            filter_big_plan_ref_ids=None,
        )
