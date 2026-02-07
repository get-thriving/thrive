"""A tag."""

from jupiter.core.common.sub.tags.name import TagName
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import NOT_USED_NAME
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    LeafSupportEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.update_action import UpdateAction


@entity
class Tag(LeafSupportEntity):
    """A tag."""

    tag_domain: ParentLink
    namespace: TagNamespace
    name: TagName

    @staticmethod
    @create_entity_action
    def new_tag(
        ctx: MutationContext,
        tag_domain_ref_id: EntityId,
        namespace: TagNamespace,
        name: TagName,
    ) -> "Tag":
        """Create a tag."""
        return Tag._create(
            ctx,
            tag_domain=ParentLink(tag_domain_ref_id),
            namespace=namespace,
            name=name,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        name: UpdateAction[TagName],
    ) -> "Tag":
        """Update the tag."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
        )

