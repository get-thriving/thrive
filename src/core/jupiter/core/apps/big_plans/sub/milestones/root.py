"""A milestone for a big plan."""

import abc

from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsEntityLinkStd,
    LeafSupportEntity,
    OwnsOne,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.storage.repository import (
    EntityAlreadyExistsError,
    LeafEntityRepository,
)
from jupiter.framework.update_action import UpdateAction


class BigPlanMilestoneAlreadyExistsForDateError(EntityAlreadyExistsError):
    """A big plan milestone already exists for the given date."""


@entity("BigPlan")
class BigPlanMilestone(LeafSupportEntity):
    """A milestone for tracking progress of a big plan."""

    big_plan: ParentLink
    date: ADate
    name: EntityName

    time_event_block = OwnsOne(
        TimeEventFullDaysBlock,
        owner=IsEntityLinkStd(NamedEntityTag.BIG_PLAN_MILESTONE.value),
    )

    @staticmethod
    @create_entity_action
    def new_big_plan_milestone(
        ctx: DomainContext,
        big_plan_ref_id: EntityId,
        date: ADate,
        name: EntityName,
    ) -> "BigPlanMilestone":
        """Create a big plan milestone."""
        return BigPlanMilestone._create(
            ctx,
            name=name,
            big_plan=ParentLink(big_plan_ref_id),
            date=date,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        date: UpdateAction[ADate],
        name: UpdateAction[EntityName],
    ) -> "BigPlanMilestone":
        """Update the big plan milestone."""
        return self._new_version(
            ctx,
            date=date.or_else(self.date),
            name=name.or_else(self.name),
        )


class BigPlanMilestoneRepository(LeafEntityRepository[BigPlanMilestone], abc.ABC):
    """The repository for big plan milestones."""
