"""The schedule domain."""

from typing import TYPE_CHECKING

from jupiter.core.schedule.sub.event_full_days.root import (
    ScheduleEventFullDays,
)
from jupiter.core.schedule.sub.event_in_day.root import (
    ScheduleEventInDay,
)
from jupiter.core.schedule.sub.export.root import ScheduleExport
from jupiter.core.schedule.sub.external_sync_log.root import (
    ScheduleExternalSyncLog,
)
from jupiter.core.schedule.sub.stream.root import ScheduleStream
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
)

if TYPE_CHECKING:
    from jupiter.core.workspaces.root import Workspace


@entity
class ScheduleDomain(TrunkEntity):
    """The schedule domain."""

    workspace: ParentLink["Workspace"]

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
        return ScheduleDomain._create(ctx, workspace=ParentLink(workspace_ref_id))
