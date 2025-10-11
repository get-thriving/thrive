"""Use case for archiving a schedule full day event."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.schedule.schedule_event_full_days import (
    ScheduleEventFullDays,
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
class ScheduleEventFullDaysArchiveArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleEventFullDaysArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ScheduleEventFullDaysArchiveArgs, None]
):
    """Use case for archiving a schedule full day event."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: ScheduleEventFullDaysArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        schedule_event_full_days = await uow.get_for(ScheduleEventFullDays).load_by_id(
            args.ref_id
        )
        if not schedule_event_full_days.can_be_modified_independently:
            raise InputValidationError("Cannot archive a non-user schedule event")
        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            ScheduleEventFullDays,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
