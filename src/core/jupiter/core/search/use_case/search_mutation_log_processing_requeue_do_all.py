"""Periodic release of stale ``processing`` claims on the search mutation log."""

import logging

from jupiter.core.app import AppComponent
from jupiter.core.config import (
    JupiterBackgroundMutationUseCase,
    JupiterComponentProperties,
)
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.context import DomainContext
from jupiter.framework.use_case import EmptyContext, background_mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args

LOGGER = logging.getLogger(__name__)


@use_case_args
class SearchMutationLogProcessingRequeueDoAllArgs(UseCaseArgsBase):
    """Args for the search mutation log processing re-queue cron."""


@background_mutation_use_case("*/5 * * * *")
class SearchMutationLogProcessingRequeueDoAllUseCase(
    JupiterBackgroundMutationUseCase[SearchMutationLogProcessingRequeueDoAllArgs, None]
):
    """Turn ``processing`` rows back into ``unindexed`` so another worker can claim them."""

    async def _execute(
        self,
        context: EmptyContext,
        args: SearchMutationLogProcessingRequeueDoAllArgs,
    ) -> None:
        """Execute the command's action."""
        _ = DomainContext.build_with_no_context_str(
            JupiterComponentProperties.for_cron(
                component=AppComponent.SEARCH_MUTATION_LOG_PROCESSING_REQUEUE,
                version=self._global_properties.version,
            ),
            TraceId.new(),
            self._time_provider.get_current_time(),
        )

        now = self._time_provider.get_current_time()
        async with (
            self._ports.search_indexing_storage_engine.get_unit_of_work() as iuow
        ):
            reset_count = await iuow.search_mutation_log_repository.reset_all_processing_to_unindexed(
                now,
            )

        LOGGER.info(
            "search_mutation_log_processing_requeue finished reset_count=%d",
            reset_count,
        )
