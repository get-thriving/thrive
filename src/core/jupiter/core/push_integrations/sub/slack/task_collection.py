"""A collection of slack tasks."""

from typing import TYPE_CHECKING

from jupiter.core.push_integrations.sub.slack.task import SlackTask
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

if TYPE_CHECKING:
    from jupiter.core.push_integrations.group import PushIntegrationGroup


@entity
class SlackTaskCollection(TrunkEntity):
    """A collection of slack tasks."""

    push_integration_group: ParentLink["PushIntegrationGroup"]

    slack_tasks = ContainsMany(SlackTask, slack_task_collection_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_slack_task_collection(
        ctx: DomainContext,
        push_integration_group_ref_id: EntityId,
    ) -> "SlackTaskCollection":
        """Create a slack task collection."""
        return SlackTaskCollection._create(
            ctx,
            push_integration_group=ParentLink(push_integration_group_ref_id),
        )
