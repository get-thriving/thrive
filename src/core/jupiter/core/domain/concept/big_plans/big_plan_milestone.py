"""A milestone for a big plan."""

import abc

from jupiter.framework_new.base.adate import ADate
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.base.entity_name import EntityName
from jupiter.framework_new.context import MutationContext
from jupiter.framework_new.entity import (
    LeafEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework_new.repository import (
    EntityAlreadyExistsError,
    LeafEntityRepository,
)
from jupiter.framework_new.update_action import UpdateAction


class BigPlanMilestoneAlreadyExistsForDateError(EntityAlreadyExistsError):
    """A big plan milestone already exists for the given date."""


@entity
class BigPlanMilestone(LeafEntity):
    """A milestone for tracking progress of a big plan."""

    big_plan: ParentLink
    date: ADate
    name: EntityName

    @staticmethod
    @create_entity_action
    def new_big_plan_milestone(
        ctx: MutationContext,
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
        ctx: MutationContext,
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
