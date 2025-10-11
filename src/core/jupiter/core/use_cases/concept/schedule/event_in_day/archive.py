"""Use case for archiving a schedule in day event."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.schedule.schedule_event_in_day import (
    ScheduleEventInDay,
)
from jupiter.core.domain.core.archival_reason import JupiterArchivalReason
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.infra.generic_crown_archiver import generic_crown_archiver
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.errors import InputValidationError
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import ProgressReporter
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ScheduleEventInDayArchiveArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleEventInDayArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ScheduleEventInDayArchiveArgs, None]
):
    """Use case for archiving a schedule in day event."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: ScheduleEventInDayArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        schedule_event_in_day = await uow.get_for(ScheduleEventInDay).load_by_id(
            args.ref_id
        )
        if not schedule_event_in_day.can_be_modified_independently:
            raise InputValidationError("Cannot archive a non-user schedule event")
        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            ScheduleEventInDay,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
