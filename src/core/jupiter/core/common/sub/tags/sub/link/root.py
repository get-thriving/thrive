"""A link between an entity and its tags."""

import abc

from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import NOT_USED_NAME
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsOneOfRefId,
    LeafSupportEntity,
    ParentLink,
    RefsMany,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction


@entity
class TagLink(LeafSupportEntity):
    """A link between an entity and its tags."""

    tag_domain: ParentLink

    namespace: TagNamespace
    source_entity_ref_id: EntityId
    ref_ids: list[EntityId]

    tags = RefsMany(Tag, ref_id=IsOneOfRefId("ref_ids"))

    @staticmethod
    @create_entity_action
    def new_tag_link(
        ctx: DomainContext,
        tag_domain_ref_id: EntityId,
        namespace: TagNamespace,
        source_entity_ref_id: EntityId,
        ref_ids: list[EntityId],
    ) -> "TagLink":
        """Create a new tag link."""
        return TagLink._create(
            ctx,
            name=NOT_USED_NAME,
            tag_domain=ParentLink(tag_domain_ref_id),
            namespace=namespace,
            source_entity_ref_id=source_entity_ref_id,
            ref_ids=ref_ids,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        ref_ids: UpdateAction[list[EntityId]],
    ) -> "TagLink":
        """Update the tag link."""
        return self._new_version(
            ctx,
            name=NOT_USED_NAME,
            ref_ids=ref_ids.or_else(self.ref_ids),
        )


class TagLinkRepository(LeafEntityRepository[TagLink], abc.ABC):
    """The repository for tag links."""

    @abc.abstractmethod
    async def upsert(self, tag_link: TagLink) -> TagLink:
        """Upsert a tag link."""

    @abc.abstractmethod
    async def load_optional_for_namespace_and_source(
        self,
        namespace: TagNamespace,
        source_entity_ref_id: EntityId,
    ) -> TagLink | None:
        """Load a tag link by its namespace and source entity reference ID."""
