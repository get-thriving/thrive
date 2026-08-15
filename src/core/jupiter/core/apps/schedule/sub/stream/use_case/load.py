"""Use case for loading a particular stream."""

from jupiter.core.apps.schedule.sub.stream.root import ScheduleStream
from jupiter.core.apps.schedule.sub.stream.service.load import (
    ScheduleStreamLoadResult,
    ScheduleStreamLoadService,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    use_case_args,
)

__all__ = [
    "ScheduleStreamLoadArgs",
    "ScheduleStreamLoadResult",
    "ScheduleStreamLoadUseCase",
]


@use_case_args
class ScheduleStreamLoadArgs(JupiterLoadCrownEntityArgs):
    """Args."""

    ref_id: EntityId
    allow_archived: bool | None


@readonly_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleStreamLoadUseCase(
    JupiterLoadCrownEntityUseCase[ScheduleStreamLoadArgs, ScheduleStreamLoadResult]
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
        schedule_stream = await self.load_entity(
            uow,
            context.user.ref_id,
            ScheduleStream,
            args.ref_id,
            allow_archived=allow_archived,
        )

        return await ScheduleStreamLoadService().do_it(
            uow,
            schedule_stream,
            crown_entity_reader=self.crown_entity_reader(uow, context.user.ref_id),
            user_ref_id=context.user.ref_id,
            allow_archived=allow_archived,
            include_publish_entity=True,
        )
