"""Use case for archiving a schedule stream."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.core.schedule.sub.stream.source import (
    ScheduleStreamSource,
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
class ScheduleStreamArchiveArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleStreamArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ScheduleStreamArchiveArgs, None]
):
    """Use case for archiving a schedule stream."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ScheduleStreamArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace
        schedule_stream = await uow.get_for(ScheduleStream).load_by_id(args.ref_id)
        if schedule_stream.source == ScheduleStreamSource.USER:
            schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
                workspace.ref_id
            )
            all_user_schedules = await uow.get_for(ScheduleStream).find_all_generic(
                parent_ref_id=schedule_domain.ref_id,
                source=ScheduleStreamSource.USER,
                allow_archived=False,
            )

            if len(all_user_schedules) == 1:
                raise InputValidationError("You cannot archive the last user schedule")

        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            ScheduleStream,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
