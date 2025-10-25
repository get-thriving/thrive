"""Use case for removing the in day event."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.core.time_events.time_event_in_day_block import (
    TimeEventInDayBlock,
)
from jupiter.core.domain.infra.generic_crown_remover import generic_crown_remover
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.errors import InputValidationError
from jupiter.framework_new.progress_reporter.reporter import ProgressReporter
from jupiter.framework_new.storage.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class TimeEventInDayBlockRemoveArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId


@mutation_use_case()
class TimeEventInDayBlockRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[TimeEventInDayBlockRemoveArgs, None]
):
    """Use case for removing the in day event."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimeEventInDayBlockRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        time_event_block = await uow.get_for(TimeEventInDayBlock).load_by_id(
            args.ref_id
        )
        if not time_event_block.can_be_modified_independently:
            raise InputValidationError("Cannot archive a linked task")
        await generic_crown_remover(
            context.domain_context,
            uow,
            progress_reporter,
            TimeEventInDayBlock,
            args.ref_id,
        )
