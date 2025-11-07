"""Use case for updating a time event in day."""

from jupiter.core.common.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.common.time_in_day import TimeInDay
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class TimeEventInDayBlockUpdateArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    start_date: UpdateAction[ADate]
    start_time_in_day: UpdateAction[TimeInDay]
    duration_mins: UpdateAction[int]


@mutation_use_case()
class TimeEventInDayBlockUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[TimeEventInDayBlockUpdateArgs, None]
):
    """Use case for updating a time event in day."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimeEventInDayBlockUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        time_event_block = await uow.get_for(TimeEventInDayBlock).load_by_id(
            args.ref_id
        )
        if not time_event_block.can_be_modified_independently:
            raise InputValidationError("Cannot update a linked task")
        time_event_block = time_event_block.update(
            context.domain_context,
            start_date=args.start_date,
            start_time_in_day=args.start_time_in_day,
            duration_mins=args.duration_mins,
        )
        time_event_block = await uow.get_for(TimeEventInDayBlock).save(time_event_block)
