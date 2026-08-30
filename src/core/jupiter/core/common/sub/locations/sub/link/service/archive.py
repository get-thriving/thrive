"""Shared service for archiving a location link."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.locations.sub.link.root import (
    LocationLink,
    LocationLinkRepository,
)
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class LocationLinkArchiveService:
    """A service for archiving a location link."""

    async def archive_for_entity(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        owner: EntityLink,
        archival_reason: JupiterArchivalReason,
    ) -> None:
        """Archive a location link for an entity."""
        location_link = await uow.get(LocationLinkRepository).load_optional_for_owner(
            owner=owner,
        )
        if location_link is None:
            return
        if location_link.archived:
            return
        location_link = location_link.mark_archived(ctx, archival_reason)
        await uow.get_for(LocationLink).save(location_link)
