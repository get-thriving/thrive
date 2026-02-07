"""Tags domain trunk entity."""

from jupiter.core.common.sub.tags.root import Tag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import ContainsMany, IsRefId, ParentLink, TrunkEntity, entity


@entity
class TagDomain(TrunkEntity):
    """Tags trunk entity."""

    workspace: ParentLink

    tags = ContainsMany(Tag, tag_domain_ref_id=IsRefId())

    @staticmethod
    def new_tag_domain(
        ctx: MutationContext,
        workspace_ref_id: EntityId,
    ) -> "TagDomain":
        """Create a tags domain."""
        return TagDomain._create(ctx, workspace=ParentLink(workspace_ref_id))

