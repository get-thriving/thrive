"""Background drain of deferred per-mutation search indexing."""

import logging
from typing import cast

from jupiter.core.app import AppComponent
from jupiter.core.config import (
    JupiterBackgroundMutationUseCase,
    JupiterComponentProperties,
)
from jupiter.core.search.mutation_log_status import SearchMutationLogStatus
from jupiter.core.search.service.entity_index import SupportsSearchEntityIndexing
from jupiter.core.search.service.mutation_indexing import (
    SearchIndexingForMutationService,
)
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.context import DomainContext
from jupiter.framework.use_case import EmptyContext, background_mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args

LOGGER = logging.getLogger(__name__)

_DRAIN_BATCH_SIZE: int = 100


@use_case_args
class SearchMutationLogDrainDoAllArgs(UseCaseArgsBase):
    """Args for the search mutation log drain cron."""


@background_mutation_use_case("*/30 * * * * *")
class SearchMutationLogDrainDoAllUseCase(
    JupiterBackgroundMutationUseCase[SearchMutationLogDrainDoAllArgs, None]
):
    """Apply search indexing for mutations left in ``unindexed`` state."""

    async def drain_one_batch(self) -> int:
        """Claim and process up to ``_DRAIN_BATCH_SIZE`` mutations.

        Returns how many rows were claimed from the queue at the start of this batch.
        ``0`` means there were no ``unindexed`` rows — the queue was empty.
        """
        service = SearchIndexingForMutationService(
            cast(SupportsSearchEntityIndexing, self._ports),
            self._concept_registry,
            self._time_provider,
            self._invocation_recorder,
        )

        claim_at = self._time_provider.get_current_time()
        async with (
            self._ports.search_indexing_storage_engine.get_unit_of_work() as iuow
        ):
            pending = await iuow.search_mutation_log_record_repository.find_all_unindexed_ordered_by_created_time(
                _DRAIN_BATCH_SIZE,
                claim_at,
            )

        if not pending:
            LOGGER.info(
                "search_mutation_log_drain finished processed=%d batch_size=%d",
                0,
                0,
            )
            return 0

        processed = 0
        for row in pending:
            try:
                await service.apply_for_mutation(row.mutation_id)

                async with (
                    self._ports.search_indexing_storage_engine.get_unit_of_work() as iuow
                ):
                    await iuow.search_mutation_log_record_repository.update_status(
                        row.mutation_id,
                        SearchMutationLogStatus.INDEXED,
                        last_modified_time=self._time_provider.get_current_time(),
                    )
                processed += 1
            except Exception:
                LOGGER.exception(
                    "search_mutation_log_drain failed mutation_id=%s",
                    row.mutation_id.the_mutation_id,
                )
                try:
                    async with (
                        self._ports.search_indexing_storage_engine.get_unit_of_work() as iuow
                    ):
                        await iuow.search_mutation_log_record_repository.update_status(
                            row.mutation_id,
                            SearchMutationLogStatus.ERROR,
                            last_modified_time=self._time_provider.get_current_time(),
                        )
                except Exception:
                    LOGGER.exception(
                        "search_mutation_log_drain could not mark mutation_id=%s as error",
                        row.mutation_id.the_mutation_id,
                    )

        LOGGER.info(
            "search_mutation_log_drain finished processed=%d batch_size=%d",
            processed,
            len(pending),
        )
        return len(pending)

    async def _execute(
        self,
        context: EmptyContext,
        args: SearchMutationLogDrainDoAllArgs,
    ) -> None:
        """Execute the command's action."""
        _ = DomainContext.build_with_no_context_str(
            JupiterComponentProperties.for_cron(
                component=AppComponent.SEARCH_MUTATION_LOG_DRAIN,
                version=self._global_properties.version,
            ),
            TraceId.new(),
            self._time_provider.get_current_time(),
        )

        await self.drain_one_batch()
