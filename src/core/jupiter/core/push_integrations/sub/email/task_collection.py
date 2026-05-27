"""A collection of email tasks."""

from jupiter.core.push_integrations.sub.email.task import EmailTask
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


@entity("PushIntegrationGroup")
class EmailTaskCollection(TrunkEntity):
    """A collection of email tasks."""

    push_integration_group: ParentLink

    email_tasks = ContainsMany(EmailTask, email_task_collection_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_email_task_collection(
        ctx: DomainContext,
        push_integration_group_ref_id: EntityId,
    ) -> "EmailTaskCollection":
        """Create a email task collection."""
        return EmailTaskCollection._create(
            ctx,
            push_integration_group=ParentLink(push_integration_group_ref_id),
        )
