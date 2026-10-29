"""Remove the image a user currently shows, from the database."""

from jupiter.core.images.root import Image
from jupiter.core.users.root import User
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import (
    DomainUnitOfWork,
    EntityNotFoundError,
)


class RemoveUserAvatarImageService:
    """Remove the image a user currently shows, from the database.

    Only the row: the user is left pointing where they did, and the object in
    the store is left for the caller to remove once the transaction has
    committed, so a failed transaction never costs anyone their picture.
    """

    async def do_it(
        self, ctx: DomainContext, uow: DomainUnitOfWork, user: User
    ) -> Image | None:
        """Remove the image, and say which one it was if there was one."""
        if user.avatar_image_ref_id is None:
            return None

        try:
            image = await uow.get_for(Image).load_by_id(
                user.avatar_image_ref_id, allow_archived=True
            )
        except EntityNotFoundError:
            return None

        # Never remove what is not theirs, whatever the pointer says.
        if image.parent_ref_id != user.ref_id:
            return None

        await uow.get_for(Image).remove(ctx, image.ref_id)
        return image
