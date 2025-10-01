"""Load previous runs of Gen."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyUseCase,
    JupiterLoggedInReadonlyUseCaseContext,
)
from jupiter.core.domain.application.gen.gen_log import GenLog
from jupiter.core.domain.application.gen.gen_log_entry import (
    GenLogEntry,
    GenLogEntryRepository,
)
from jupiter.core.use_cases.infra.use_cases import (
    readonly_use_case,
)
from jupiter.framework_new.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class GenLoadRunsArgs(UseCaseArgsBase):
    """GenLoadRunsArgs."""


@use_case_result
class GenLoadRunsResult(UseCaseResultBase):
    """GenLoadRunsResult."""

    entries: list[GenLogEntry]


@readonly_use_case()
class GenLoadRunsUseCase(
    JupiterLoggedInReadonlyUseCase[GenLoadRunsArgs, GenLoadRunsResult]
):
    """Load previous runs of task generation."""

    async def _execute(
        self,
        context: JupiterLoggedInReadonlyUseCaseContext,
        args: GenLoadRunsArgs,
    ) -> GenLoadRunsResult:
        """Execute the use case."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            gen_log = await uow.get_for(GenLog).load_by_parent(context.workspace.ref_id)
            entries = await uow.get(GenLogEntryRepository).find_last(gen_log.ref_id, 30)

        return GenLoadRunsResult(entries=entries)
