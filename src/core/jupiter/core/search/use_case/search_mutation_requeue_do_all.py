"""Periodic release of stale ``processing`` claims on the search mutation log."""

import logging

from jupiter.core.config import (
    JupiterBackgroundMutationContext,
    JupiterBackgroundMutationUseCase,
)
from jupiter.framework.use_case import background_mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args

LOGGER = logging.getLogger(__name__)


@use_case_args
class SearchMutationRequeueDoAllArgs(UseCaseArgsBase):
    """Args for the search mutation log processing re-queue cron."""


@background_mutation_use_case("*/5 * * * *")
class SearchMutationRequeueDoAllUseCase(
    JupiterBackgroundMutationUseCase[SearchMutationRequeueDoAllArgs, None]
):
    """Turn ``processing`` rows back into ``unindexed`` so another worker can claim them."""

    async def _execute(
        self,
        context: JupiterBackgroundMutationContext,
        args: SearchMutationRequeueDoAllArgs,
    ) -> None:
        """Execute the command's action."""
        _ = context

        now = self._time_provider.get_current_time()
        async with (
            self._ports.search_indexing_storage_engine.get_unit_of_work() as iuow
        ):
            reset_count = await iuow.search_mutation_log_record_repository.reset_all_processing_to_unindexed(
                now,
            )

        LOGGER.info(
            "search_mutation_requeue finished reset_count=%d",
            reset_count,
        )
