"""Use case for loading a schedule in day event."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.schedule.sub.event_in_day.root import ScheduleEventInDay
from jupiter.core.schedule.sub.event_in_day.service.load import (
    ScheduleEventInDayLoadResult,
    ScheduleEventInDayLoadService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import use_case_args

__all__ = [
    "ScheduleEventInDayLoadArgs",
    "ScheduleEventInDayLoadResult",
    "ScheduleEventInDayLoadUseCase",
]


@use_case_args
class ScheduleEventInDayLoadArgs(JupiterLoadCrownEntityArgs):
    """Args."""

    ref_id: EntityId
    allow_archived: bool | None


@readonly_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleEventInDayLoadUseCase(
    JupiterLoadCrownEntityUseCase[
        ScheduleEventInDayLoadArgs, ScheduleEventInDayLoadResult
    ]
):
    """Use case for loading a schedule in day event."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ScheduleEventInDayLoadArgs,
    ) -> ScheduleEventInDayLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        schedule_event_in_day = await self.load_entity(
            uow,
            context.user.ref_id,
            ScheduleEventInDay,
            args.ref_id,
            allow_archived=allow_archived,
        )

        return await ScheduleEventInDayLoadService().do_it(
            uow,
            context.workspace.ref_id,
            schedule_event_in_day,
            crown_entity_reader=self.crown_entity_reader(uow, context.user.ref_id),
            allow_archived=allow_archived,
        )
