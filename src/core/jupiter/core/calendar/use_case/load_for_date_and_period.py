"""Load all the calendar specific entities for a given date and period."""

from jupiter.core.apps.schedule.domain import ScheduleDomain
from jupiter.core.apps.schedule.sub.stream.root import ScheduleStream
from jupiter.core.calendar.service.load_for_date_and_period import (
    CalendarLoadForDateAndPeriodResult,
    CalendarLoadForDateAndPeriodService,
)
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.status.root import AccessStatusRepository
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    use_case_args,
)


@use_case_args
class CalendarLoadForDateAndPeriodArgs(JupiterLoadCrownEntityArgs):
    """Args."""

    right_now: ADate
    period: RecurringTaskPeriod
    stats_subperiod: RecurringTaskPeriod | None


@readonly_use_case(WorkspaceFeature.SCHEDULE)
class CalendarLoadForDateAndPeriodUseCase(
    JupiterLoadCrownEntityUseCase[
        CalendarLoadForDateAndPeriodArgs, CalendarLoadForDateAndPeriodResult
    ]
):
    """Use case for loading all the calendar entities for a given date and period."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: CalendarLoadForDateAndPeriodArgs,
    ) -> CalendarLoadForDateAndPeriodResult:
        """Execute the action."""
        CalendarLoadForDateAndPeriodService.validate_stats_subperiod(
            args.period, args.stats_subperiod
        )

        workspace = context.workspace
        time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
            workspace.ref_id
        )
        schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
            workspace.ref_id
        )

        # Cross-workspace: include streams shared with this user.
        stream_statuses = await uow.get(AccessStatusRepository).find_all_for_user(
            NamedEntityTag.SCHEDULE_STREAM.value,
            context.user.ref_id,
        )
        accessible_stream_ref_ids = [
            status.entity.ref_id
            for status in stream_statuses
            if status.access_level.allows(AccessLevel.READER)
        ]
        if accessible_stream_ref_ids:
            schedule_streams = await uow.get_for(ScheduleStream).find_all_generic(
                parent_ref_id=None,
                allow_archived=False,
                ref_id=accessible_stream_ref_ids,
            )
        else:
            schedule_streams = []
        schedule_streams_by_ref_id: dict[EntityId, ScheduleStream] = {
            ss.ref_id: ss for ss in schedule_streams
        }

        return await CalendarLoadForDateAndPeriodService().load(
            uow,
            workspace,
            args.right_now,
            args.period,
            args.stats_subperiod,
            time_event_domain,
            schedule_domain,
            schedule_streams_by_ref_id,
            crown_entity_reader=self.crown_entity_reader(uow, context.user.ref_id),
            schedule_stream_ref_id=None,
            user_ref_id=context.user.ref_id,
        )
