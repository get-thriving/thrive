"""Use case for removing a schedule stream."""

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
from jupiter.framework.utils.generic_crown_remover import generic_crown_remover


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
            and schedule_stream.source == ScheduleStreamSource.USER
        ):
            schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
                workspace.ref_id
            )
            all_user_schedule_streams = await uow.get_for(
                ScheduleStream
            ).find_all_generic(
                parent_ref_id=schedule_domain.ref_id,
                source=ScheduleStreamSource.USER,
                allow_archived=False,
            )

            if len(all_user_schedule_streams) == 1:
                raise InputValidationError("You cannot remove the last user schedule")

        await generic_crown_remover(
            context.domain_context, uow, progress_reporter, ScheduleStream, args.ref_id
        )
