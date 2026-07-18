"""Use case for loading a schedule full days event."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.schedule.sub.event_full_days.root import ScheduleEventFullDays
from jupiter.core.schedule.sub.event_full_days.service.load import (
    ScheduleEventFullDaysLoadResult,
    ScheduleEventFullDaysLoadService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import use_case_args

__all__ = [
    "ScheduleEventFullDaysLoadArgs",
    "ScheduleEventFullDaysLoadResult",
    "ScheduleEventFullDaysLoadUseCase",
]


@use_case_args
class ScheduleEventFullDaysLoadArgs(JupiterLoadCrownEntityArgs):
    """Args."""

    ref_id: EntityId
    allow_archived: bool | None


@readonly_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleEventFullDaysLoadUseCase(
    JupiterLoadCrownEntityUseCase[
        ScheduleEventFullDaysLoadArgs, ScheduleEventFullDaysLoadResult
    ]
):
    """Use case for loading a schedule full days event."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ScheduleEventFullDaysLoadArgs,
    ) -> ScheduleEventFullDaysLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        schedule_event_full_days = await self.load_entity(
            uow,
            context.user.ref_id,
            ScheduleEventFullDays,
            args.ref_id,
            allow_archived=allow_archived,
        )

        return await ScheduleEventFullDaysLoadService().do_it(
            uow,
            context.workspace.ref_id,
            schedule_event_full_days,
            crown_entity_reader=self.crown_entity_reader(uow, context.user.ref_id),
            allow_archived=allow_archived,
        )
