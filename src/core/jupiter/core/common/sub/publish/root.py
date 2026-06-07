"""Publish domain trunk entity."""

from jupiter.core.common.sub.publish.sub.entity.root import PublishEntity
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    entity,
)


@entity("Workspace")
class PublishDomain(TrunkEntity):
    """Publish trunk entity."""

    workspace: ParentLink

    entities = ContainsMany(PublishEntity, publish_domain_ref_id=IsRefId())

    @staticmethod
    def new_publish_domain(
        ctx: DomainContext,
        workspace_ref_id: EntityId,
    ) -> "PublishDomain":
        """Create a publish domain."""
        return PublishDomain._create(ctx, workspace=ParentLink(workspace_ref_id))
