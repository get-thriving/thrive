"""Guest readonly use case for loading calendar data for a published schedule stream."""

from jupiter.core.calendar.service.load_for_date_and_period import (
    CalendarLoadForDateAndPeriodService,
)
from jupiter.core.calendar.use_case.load_for_date_and_period import (
    CalendarLoadForDateAndPeriodResult,
)
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntityRepository
from jupiter.core.common.sub.publish.sub.entity.status import PublishEntityStatus
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class CalendarLoadPublicForScheduleStreamArgs(UseCaseArgsBase):
    """CalendarLoadPublicForScheduleStream args."""

    external_id: PublishExternalId
    right_now: ADate
    period: RecurringTaskPeriod
    stats_subperiod: RecurringTaskPeriod | None


class CalendarLoadPublicForScheduleStreamUseCase(
    JupiterGuestReadonlyUseCase[
        CalendarLoadPublicForScheduleStreamArgs,
        CalendarLoadForDateAndPeriodResult,
    ]
):
    """Load calendar entries and stats for a published schedule stream."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: CalendarLoadPublicForScheduleStreamArgs,
    ) -> CalendarLoadForDateAndPeriodResult:
        """Execute the use case."""
        CalendarLoadForDateAndPeriodService.validate_stats_subperiod(
            args.period, args.stats_subperiod
        )

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            publish_entity = await uow.get(PublishEntityRepository).load_by_external_id(
                args.external_id
            )

            if publish_entity.status != PublishEntityStatus.ACTIVE:
                raise InputValidationError(
                    "The publish entity is not active and cannot be loaded."
                )

            if publish_entity.owner.the_type != NamedEntityTag.SCHEDULE_STREAM.value:
                raise InputValidationError(
                    "The publish entity does not refer to a schedule stream."
                )
            if publish_entity.owner.purpose != "std":
                raise InputValidationError(
                    "The publish entity owner link purpose must be 'std'."
                )

            publish_domain = await uow.get_for(PublishDomain).load_by_id(
                publish_entity.publish_domain.ref_id
            )
            schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
                publish_domain.workspace.ref_id
            )
            schedule_stream = await uow.get_for(ScheduleStream).load_by_id(
                publish_entity.owner.ref_id,
                allow_archived=False,
            )
            if schedule_stream.parent_ref_id != schedule_domain.ref_id:
                raise InputValidationError(
                    "The publish entity does not refer to a workspace schedule stream."
                )

            workspace = await uow.get_for(Workspace).load_by_id(
                publish_domain.workspace.ref_id
            )

            time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
                workspace.ref_id
            )

            schedule_streams_by_ref_id: dict[EntityId, ScheduleStream] = {
                schedule_stream.ref_id: schedule_stream
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
                schedule_stream_ref_id=schedule_stream.ref_id,
            )
