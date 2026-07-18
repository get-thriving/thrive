"""Use case for refreshing stats for a journal."""

from jupiter.core.app import AppCore
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.journals.root import Journal
from jupiter.core.stats.service.stats import StatsService
from jupiter.core.sync_target import SyncTarget
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class JournalRefreshStatsArgs(JupiterUpdateCrownEntityArgs):
    """JournalRefreshStats args."""

    ref_id: EntityId


@mutation_use_case(
    WorkspaceFeature.JOURNALS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class JournalRefreshStatsUseCase(
    JupiterUpdateCrownEntityUseCase[JournalRefreshStatsArgs, None]
):
    """Use case for refreshing stats for a journal."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: JournalRefreshStatsArgs,
    ) -> None:
        """Execute the command's action."""
        await self.check_entity(uow, context.user.ref_id, Journal, args.ref_id)

    async def _perform_post_transactional_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: JournalRefreshStatsArgs,
        result: None,
    ) -> None:
        """Execute the command's post-mutation work."""
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
