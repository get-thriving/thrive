"""A standard question used when writing time plans."""

from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    LeafSupportEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.update_action import UpdateAction


@entity("TimePlanDomain")
class TimePlanQuestion(LeafSupportEntity):
    """A standard question attached to the time plan domain."""

    time_plan_domain: ParentLink
    name: EntityName
    period: RecurringTaskPeriod

    @staticmethod
    @create_entity_action
    def new_time_plan_question(
        ctx: DomainContext,
        time_plan_domain_ref_id: EntityId,
        name: EntityName,
        period: RecurringTaskPeriod,
    ) -> "TimePlanQuestion":
        """Create a time plan question."""
        return TimePlanQuestion._create(
            ctx,
            time_plan_domain=ParentLink(time_plan_domain_ref_id),
            name=name,
            period=period,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[EntityName],
    ) -> "TimePlanQuestion":
        """Update the time plan question."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
        )
