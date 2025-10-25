"""Use case for removing a schedule stream."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.schedule.schedule_domain import ScheduleDomain
from jupiter.core.domain.concept.schedule.schedule_source import (
    ScheduleSource,
)
from jupiter.core.domain.concept.schedule.schedule_stream import ScheduleStream
from jupiter.core.domain.features import WorkspaceFeature
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
class ScheduleStreamRemoveArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleStreamRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ScheduleStreamRemoveArgs, None]
):
    """Use case for removing a schedule stream."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ScheduleStreamRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace
        schedule_stream = await uow.get_for(ScheduleStream).load_by_id(
            args.ref_id, allow_archived=True
        )
        if (
            not schedule_stream.archived
            and schedule_stream.source == ScheduleSource.USER
        ):
            schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
                workspace.ref_id
            )
            all_user_schedule_streams = await uow.get_for(
                ScheduleStream
            ).find_all_generic(
                parent_ref_id=schedule_domain.ref_id,
                source=ScheduleSource.USER,
                allow_archived=False,
            )

            if len(all_user_schedule_streams) == 1:
                raise InputValidationError("You cannot remove the last user schedule")

        await generic_crown_remover(
            context.domain_context, uow, progress_reporter, ScheduleStream, args.ref_id
        )
