"""Shared service for removing a tag link."""

from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLink, TagLinkRepository
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class TagLinkRemoveService:
    """A service for removing a tag link."""

    async def remove_for_entity(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        namespace: TagNamespace,
        source_entity_ref_id: EntityId,
    ) -> None:
        """Remove a tag link."""
        tag_link = await uow.get(
            TagLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=namespace,
            source_entity_ref_id=source_entity_ref_id,
        )
        if tag_link is None:
            return
        await uow.get_for(TagLink).remove(tag_link.ref_id)
