"""Use case for archiving a schedule full day event."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.schedule.sub.event_full_days.root import (
    ScheduleEventFullDays,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_crown_archiver import generic_crown_archiver


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
        context: JupiterLoggedInMutationContext,
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
