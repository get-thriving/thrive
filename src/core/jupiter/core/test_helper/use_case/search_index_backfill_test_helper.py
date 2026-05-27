"""Drain deferred search indexing from tests (same work as the mutation-log drain cron)."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterLoggedInMutationUseCase,
)
from jupiter.core.env import Env
from jupiter.core.search.use_case.search_mutation_log_drain_do_all import (
    SearchMutationLogDrainDoAllUseCase,
)
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class SearchIndexBackfillTestHelperArgs(UseCaseArgsBase):
    """Arguments for the search index backfill test helper."""


@mutation_use_case(exclude_globally=[Env.PRODUCTION])
class SearchIndexBackfillTestHelperUseCase(
    JupiterLoggedInMutationUseCase[SearchIndexBackfillTestHelperArgs, None]
):
    """Drain **all** pending ``unindexed`` search mutation log rows (same batches as the cron).

    Each batch handles at most 100 mutations (oldest first). Tests enqueue indexing after many
    mutations; a single batch can leave newer rows unprocessed until later batches.
    """

    async def _perform_mutation(
        self,
        _progress_reporter: ProgressReporter,
        _context: JupiterLoggedInMutationContext,
        _args: SearchIndexBackfillTestHelperArgs,
    ) -> None:
        drain = SearchMutationLogDrainDoAllUseCase(
            ports=self._ports,
            global_properties=self._global_properties,
            time_provider=self._time_provider,
            realm_codec_registry=self._realm_codec_registry,
            concept_registry=self._concept_registry,
            invocation_recorder=self._invocation_recorder,
            progress_reporter_factory=self._progress_reporter_factory,
        )
        # Bound iterations so a broken queue cannot hang the test suite (~50k mutations max).
        _max_batches = 500
        for _ in range(_max_batches):
            claimed = await drain.drain_one_batch()
            if claimed == 0:
                break
