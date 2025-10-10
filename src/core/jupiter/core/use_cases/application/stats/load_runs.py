"""Load previous runs of stats computation."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyUseCase,
    JupiterLoggedInReadonlyUseCaseContext,
)
from jupiter.core.domain.application.stats.stats_log import StatsLog
from jupiter.core.domain.application.stats.stats_log_entry import (
    StatsLogEntry,
    StatsLogEntryRepository,
)
from jupiter.framework_new.use_case import (
    readonly_use_case,
)
from jupiter.framework_new.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class StatsLoadRunsArgs(UseCaseArgsBase):
    """StatsLoadRunsArgs."""


@use_case_result
class StatsLoadRunsResult(UseCaseResultBase):
    """StatsLoadRunsResult."""

    entries: list[StatsLogEntry]


@readonly_use_case()
class StatsLoadRunsUseCase(
    JupiterLoggedInReadonlyUseCase[StatsLoadRunsArgs, StatsLoadRunsResult]
):
    """Load previous runs of stats computation."""

    async def _execute(
        self,
        context: JupiterLoggedInReadonlyUseCaseContext,
        args: StatsLoadRunsArgs,
    ) -> StatsLoadRunsResult:
        """Execute the use case."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            stats_log = await uow.get_for(StatsLog).load_by_parent(
                context.workspace.ref_id
            )
            entries = await uow.get(StatsLogEntryRepository).find_last(
                stats_log.ref_id, 30
            )

        return StatsLoadRunsResult(entries=entries)
