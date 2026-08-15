"""A sync log attached to a schedule domain."""

from jupiter.core.apps.schedule.sub.external_sync_log.entry import (
    ScheduleExternalSyncLogEntry,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    create_entity_action,
    entity,
)


@entity("ScheduleDomain")
class ScheduleExternalSyncLog(TrunkEntity):
    """A sync log attached to a schedule domain."""

    schedule_domain: ParentLink

    entries = ContainsMany(
        ScheduleExternalSyncLogEntry, schedule_external_sync_log_ref_id=IsRefId()
    )

    @staticmethod
    @create_entity_action
    def new_schedule_external_sync_log(
        ctx: DomainContext, schedule_domain_ref_id: EntityId
    ) -> "ScheduleExternalSyncLog":
        """Create a new sync log."""
        return ScheduleExternalSyncLog._create(
            ctx,
            schedule_domain=ParentLink(schedule_domain_ref_id),
        )
