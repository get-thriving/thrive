"""Find the link to show a user's picture from."""

from typing import Final

from jupiter.core.images.root import Image
from jupiter.core.images.store.image_store import ImageStore
from jupiter.core.images.store.image_url import ImageUrl
from jupiter.core.users.root import User
from jupiter.framework.storage.repository import (
    DomainUnitOfWork,
    EntityNotFoundError,
)


class LoadUserAvatarUrlService:
    """Find the link to show a user's picture from.

    The picture they chose if they have one, and the one drawn from their name
    otherwise.
    """

    _image_store: Final[ImageStore]

    def __init__(self, image_store: ImageStore) -> None:
        """Constructor."""
        self._image_store = image_store

    async def do_it(self, uow: DomainUnitOfWork, user: User) -> ImageUrl:
        """Find the link."""
        if user.avatar_image_ref_id is not None:
            try:
                image = await uow.get_for(Image).load_by_id(user.avatar_image_ref_id)
            except EntityNotFoundError:
                # Pointing at nothing is not worth failing a page for.
                pass
            else:
                link = await self._image_store.get_serving_link(
                    image.purpose, image.store_path
                )
                return link.url

        return ImageUrl(user.generated_avatar.avatar_as_data_url)
