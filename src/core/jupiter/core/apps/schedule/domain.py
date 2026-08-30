"""The schedule domain."""

from jupiter.core.apps.schedule.sub.event_full_days.root import (
    ScheduleEventFullDays,
)
from jupiter.core.apps.schedule.sub.event_in_day.root import (
    ScheduleEventInDay,
)
from jupiter.core.apps.schedule.sub.export.root import ScheduleExport
from jupiter.core.apps.schedule.sub.external_sync_log.root import (
    ScheduleExternalSyncLog,
)
from jupiter.core.apps.schedule.sub.stream.root import ScheduleStream
from jupiter.core.common.timezone import Timezone
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsMany,
    ContainsOne,
    IsRefId,
    ParentLink,
    TrunkEntity,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.update_action import UpdateAction

# How many timezones besides the user's own one the calendar can show. Two is
# what fits next to the hours column without crowding it out.
MAX_ADDITIONAL_TIMEZONES = 2


@entity("Workspace")
class ScheduleDomain(TrunkEntity):
    """The schedule domain."""

    workspace: ParentLink

    # Timezones the calendar shows alongside the one of the user looking at it.
    additional_timezones: list[Timezone]

    external_sync_log = ContainsOne(
        ScheduleExternalSyncLog, schedule_domain_ref_id=IsRefId()
    )

    streams = ContainsMany(ScheduleStream, schedule_domain_ref_id=IsRefId())
    exports = ContainsMany(ScheduleExport, schedule_domain_ref_id=IsRefId())
    in_day_events = ContainsMany(ScheduleEventInDay, schedule_domain_ref_id=IsRefId())
    full_days_events = ContainsMany(
        ScheduleEventFullDays, schedule_domain_ref_id=IsRefId()
    )

    @staticmethod
    @create_entity_action
    def new_schedule_domain(
        ctx: DomainContext, workspace_ref_id: EntityId
    ) -> "ScheduleDomain":
        """Create a new schedule domain."""
        return ScheduleDomain._create(
            ctx,
            workspace=ParentLink(workspace_ref_id),
            additional_timezones=[],
        )

    @update_entity_action
    def change_additional_timezones(
        self,
        ctx: DomainContext,
        additional_timezones: UpdateAction[list[Timezone]],
    ) -> "ScheduleDomain":
        """Change the timezones the calendar shows besides the user's own one."""
        return self._new_version(
            ctx,
            additional_timezones=additional_timezones.transform(
                ScheduleDomain._check_additional_timezones
            ).or_else(self.additional_timezones),
        )

    @staticmethod
    def _check_additional_timezones(
        additional_timezones: list[Timezone],
    ) -> list[Timezone]:
        """Check the additional timezones are few enough and distinct."""
        if len(additional_timezones) > MAX_ADDITIONAL_TIMEZONES:
            raise InputValidationError(
                f"Expected at most {MAX_ADDITIONAL_TIMEZONES} additional timezones"
            )
        if len(set(additional_timezones)) != len(additional_timezones):
            raise InputValidationError("Expected the additional timezones to be unique")
        return additional_timezones
