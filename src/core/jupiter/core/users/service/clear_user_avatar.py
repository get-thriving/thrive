"""Go back to the picture generated from a user's name."""

from jupiter.core.common.sub.images.sub.image.root import Image
from jupiter.core.users.root import User
from jupiter.core.users.service.remove_user_avatar_image import (
    RemoveUserAvatarImageService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class ClearUserAvatarService:
    """Go back to the picture generated from a user's name.

    Meant to run in a transaction. Gives the image that was removed, if there
    was one, so that its object can be removed after the commit.
    """

    async def do_it(
        self, ctx: DomainContext, uow: DomainUnitOfWork, user_ref_id: EntityId
    ) -> Image | None:
        """Clear the picture."""
        user = await uow.get_for(User).load_by_id(user_ref_id)

        removed = await RemoveUserAvatarImageService().do_it(ctx, uow, user)
        await uow.get_for(User).save(user.change_avatar(ctx, None))

        return removed
