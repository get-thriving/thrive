"""Shared service for archiving a tag link."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.tags.sub.link.root import TagLink, TagLinkRepository
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class TagLinkArchiveService:
    """A service for archiving a tag link."""

    async def archive_for_entity(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        owner: EntityLink,
        archival_reason: JupiterArchivalReason,
    ) -> None:
        """Archive a tag link for an entity."""
        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=owner,
        )
        if tag_link is None:
            return
        if tag_link.archived:
            return
        tag_link = tag_link.mark_archived(ctx, archival_reason)
        await uow.get_for(TagLink).save(tag_link)
