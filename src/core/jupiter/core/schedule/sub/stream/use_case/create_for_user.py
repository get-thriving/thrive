"""Use case for creating a schedule stream."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.schedule.sub.stream.color import (
    ScheduleStreamColor,
)
from jupiter.core.schedule.sub.stream.name import ScheduleStreamName
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)
from jupiter.framework.utils.generic_creator import generic_creator


@use_case_args
class ScheduleStreamCreateForUserArgs(UseCaseArgsBase):
    """Args."""

    name: ScheduleStreamName
    color: ScheduleStreamColor


@use_case_result
class ScheduleStreamCreateForUserResult(UseCaseResultBase):
    """Result."""

    new_schedule_stream: ScheduleStream


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleStreamCreateForUserUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        ScheduleStreamCreateForUserArgs, ScheduleStreamCreateForUserResult
    ]
):
    """Use case for creating a schedule stream."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ScheduleStreamCreateForUserArgs,
    ) -> ScheduleStreamCreateForUserResult:
        """Perform the transactional mutation."""
        workspace = context.workspace
        schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
            workspace.ref_id
        )
        schedule_stream = ScheduleStream.new_schedule_stream_for_user(
            context.domain_context,
            schedule_domain_ref_id=schedule_domain.ref_id,
            name=args.name,
            color=args.color,
        )
        schedule_stream = await generic_creator(uow, progress_reporter, schedule_stream)
        return ScheduleStreamCreateForUserResult(new_schedule_stream=schedule_stream)
