"""Use case for removing a full day event."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.schedule.schedule_event_full_days import (
    ScheduleEventFullDays,
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
class ScheduleEventFullDaysRemoveArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleEventFullDaysRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ScheduleEventFullDaysRemoveArgs, None]
):
    """Use case for removing a full day event."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ScheduleEventFullDaysRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        schedule_event_full_days = await uow.get_for(ScheduleEventFullDays).load_by_id(
            args.ref_id
        )
        if not schedule_event_full_days.can_be_modified_independently:
            raise InputValidationError("Cannot remove a non-user schedule event")
        await generic_crown_remover(
            context.domain_context,
            uow,
            progress_reporter,
            ScheduleEventFullDays,
            args.ref_id,
        )
