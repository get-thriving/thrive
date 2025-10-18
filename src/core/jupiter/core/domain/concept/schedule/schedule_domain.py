"""The schedule domain."""

from jupiter.core.domain.concept.schedule.schedule_event_full_days import (
    ScheduleEventFullDays,
)
from jupiter.core.domain.concept.schedule.schedule_event_in_day import (
    ScheduleEventInDay,
)
from jupiter.core.domain.concept.schedule.schedule_external_sync_log import (
    ScheduleExternalSyncLog,
)
from jupiter.core.domain.concept.schedule.schedule_stream import ScheduleStream
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.context import MutationContext
from jupiter.framework_new.entity import (
    ContainsMany,
    ContainsOne,
    IsRefId,
    ParentLink,
    TrunkEntity,
    create_entity_action,
    entity,
)


@entity
class ScheduleDomain(TrunkEntity):
    """The schedule domain."""

    workspace: ParentLink

    external_sync_log = ContainsOne(
        ScheduleExternalSyncLog, schedule_domain_ref_id=IsRefId()
    )

    streams = ContainsMany(ScheduleStream, schedule_domain_ref_id=IsRefId())
    in_day_events = ContainsMany(ScheduleEventInDay, schedule_domain_ref_id=IsRefId())
    full_days_events = ContainsMany(
        ScheduleEventFullDays, schedule_domain_ref_id=IsRefId()
    )

    @staticmethod
    @create_entity_action
    def new_schedule_domain(
        ctx: MutationContext, workspace_ref_id: EntityId
    ) -> "ScheduleDomain":
        """Create a new schedule domain."""
        return ScheduleDomain._create(ctx, workspace=ParentLink(workspace_ref_id))
