"""Use case for removing a schedule in day event."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.schedule.schedule_event_in_day import (
    ScheduleEventInDay,
)
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.infra.generic_crown_remover import generic_crown_remover
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.errors import InputValidationError
from jupiter.framework_new.progress_reporter import ProgressReporter
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ScheduleEventInDayRemoveArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleEventInDayRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ScheduleEventInDayRemoveArgs, None]
):
    """Use case for removing a schedule in day event."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ScheduleEventInDayRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        schedule_event_in_day = await uow.get_for(ScheduleEventInDay).load_by_id(
            args.ref_id
        )
        if not schedule_event_in_day.can_be_modified_independently:
            raise InputValidationError("Cannot remove a non-user schedule event")
        await generic_crown_remover(
            context.domain_context,
            uow,
            progress_reporter,
            ScheduleEventInDay,
            args.ref_id,
        )
