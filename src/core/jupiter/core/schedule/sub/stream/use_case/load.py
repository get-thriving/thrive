"""Use case for loading a particular stream."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.core.schedule.sub.stream.service.load import (
    ScheduleStreamLoadResult,
    ScheduleStreamLoadService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    use_case_args,
)

__all__ = [
    "ScheduleStreamLoadArgs",
    "ScheduleStreamLoadResult",
    "ScheduleStreamLoadUseCase",
]


@use_case_args
class ScheduleStreamLoadArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    allow_archived: bool | None


@readonly_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleStreamLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        ScheduleStreamLoadArgs, ScheduleStreamLoadResult
    ]
):
    """Use case for loading a particular stream."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ScheduleStreamLoadArgs,
    ) -> ScheduleStreamLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        schedule_stream = await uow.get_for(ScheduleStream).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )

        return await ScheduleStreamLoadService().do_it(
            uow,
            schedule_stream,
            allow_archived=allow_archived,
            include_publish_entity=True,
        )
