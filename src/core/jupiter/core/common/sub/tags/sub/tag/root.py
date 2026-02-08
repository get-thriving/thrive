"""A tag."""

import abc

from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.tag.name import TagName
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    LeafSupportEntity,
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


class TagAlreadyExistsError(EntityAlreadyExistsError):
    """Error raised when a tag already exists."""


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


class TagRepository(LeafEntityRepository[Tag], abc.ABC):
    """The repository for tags."""

    @abc.abstractmethod
    async def upsert(
        self, parent_ref_id: EntityId, namespace: TagNamespace, name: TagName
    ) -> Tag:
        """Upsert a tag for a namespace and name."""
