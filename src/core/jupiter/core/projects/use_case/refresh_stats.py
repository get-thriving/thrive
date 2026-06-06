"""A use case for refreshing stats for a project."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.stats.service.stats import StatsService
from jupiter.core.sync_target import SyncTarget
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ProjectRefreshStatsArgs(UseCaseArgsBase):
    """The arguments for the project refresh stats use case."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.PROJECTS)
class ProjectRefreshStatsUseCase(
    JupiterLoggedInMutationUseCase[ProjectRefreshStatsArgs, None]
):
    """A use case for refreshing stats for a project."""

    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ProjectRefreshStatsArgs,
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
            stats_targets=[SyncTarget.PROJECTS],
            filter_project_ref_ids=[args.ref_id],
            filter_habit_ref_ids=None,
            filter_journal_ref_ids=None,
        )
