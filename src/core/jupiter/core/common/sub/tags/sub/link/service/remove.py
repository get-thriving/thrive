"""Shared service for removing a tag link."""

from jupiter.core.common.sub.tags.sub.link.root import TagLink, TagLinkRepository
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class TagLinkRemoveService:
    """A service for removing a tag link."""

    async def remove_for_entity(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        owner: EntityLink,
    ) -> None:
        """Remove a tag link."""
        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=owner,
        )
        if tag_link is None:
            return
        await uow.get_for(TagLink).remove(ctx, tag_link.ref_id)
