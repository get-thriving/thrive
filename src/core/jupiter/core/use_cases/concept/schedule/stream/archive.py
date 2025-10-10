"""Use case for archiving a schedule stream."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.schedule.schedule_domain import ScheduleDomain
from jupiter.core.domain.concept.schedule.schedule_source import (
    ScheduleSource,
)
from jupiter.core.domain.concept.schedule.schedule_stream import ScheduleStream
from jupiter.core.domain.core.archival_reason import ArchivalReason
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
        context: JupiterLoggedInMutationUseCaseContext,
        args: ScheduleStreamArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace
        schedule_stream = await uow.get_for(ScheduleStream).load_by_id(args.ref_id)
        if schedule_stream.source == ScheduleSource.USER:
            schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
                workspace.ref_id
            )
            all_user_schedules = await uow.get_for(ScheduleStream).find_all_generic(
                parent_ref_id=schedule_domain.ref_id,
                source=ScheduleSource.USER,
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
            ArchivalReason.USER,
        )
