"""Shared service for removing a location link."""

from jupiter.core.common.sub.locations.sub.link.root import (
    LocationLink,
    LocationLinkRepository,
)
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class LocationLinkRemoveService:
    """A service for removing a location link."""

    async def remove_for_entity(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        owner: EntityLink,
    ) -> None:
        """Remove a location link."""
        location_link = await uow.get(LocationLinkRepository).load_optional_for_owner(
            owner=owner,
        )
        if location_link is None:
            return
        await uow.get_for(LocationLink).remove(ctx, location_link.ref_id)
