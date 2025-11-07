"""Time event domain trunk entity."""

from jupiter.core.common.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.common.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    entity,
)


@entity
class TimeEventDomain(TrunkEntity):
    """Time event trunk entity."""

    workspace: ParentLink

    in_day_blocks = ContainsMany(
        TimeEventInDayBlock, time_event_domain_ref_id=IsRefId()
    )
    full_days_blocks = ContainsMany(
        TimeEventFullDaysBlock, time_event_domain_ref_id=IsRefId()
    )

    @staticmethod
    def new_time_event_domain(
        ctx: MutationContext,
        workspace_ref_id: EntityId,
    ) -> "TimeEventDomain":
        """Create a inbox task collection."""
        return TimeEventDomain._create(ctx, workspace=ParentLink(workspace_ref_id))
