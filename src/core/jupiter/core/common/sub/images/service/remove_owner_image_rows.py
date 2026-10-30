"""Remove the rows of every image an owner has."""

from jupiter.core.common.sub.images.sub.image.root import Image
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork, EntityNotFoundError


class RemoveOwnerImageRowsService:
    """Remove the rows of every image an owner has.

    The images sit under the images domain, not under their owner, so destroying
    a user or a workspace does not take them along. Meant to run in the same
    transaction as the destruction, once the objects are out of the store.
    """

    async def do_it(
        self, ctx: DomainContext, uow: DomainUnitOfWork, owner: EntityLink
    ) -> None:
        """Remove the rows."""
        images = await uow.get_for(Image).find_all_generic(
            owner=owner, allow_archived=True
        )
        for image in images:
            try:
                await uow.get_for(Image).remove(ctx, image.ref_id)
            except EntityNotFoundError:
                continue
