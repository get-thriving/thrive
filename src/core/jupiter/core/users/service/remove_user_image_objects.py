"""Remove the objects of every image a user has from the image store."""

from typing import Final

from jupiter.core.images.root import Image
from jupiter.core.images.store.image_store import ImageStore
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainStorageEngine


class RemoveUserImageObjectsService:
    """Remove the objects of every image a user has from the image store.

    The rows are left alone: they go with the user, or stay with them if the
    user is only archived. A user is destroyed in the database with all their
    rows and the store knows nothing of that, so the objects have to be removed
    on the side. Strict, as there is no one else to find the objects afterwards:
    if the store fails, the caller learns of it, and can choose to try again or to leave them.
    """

    _domain_storage_engine: Final[DomainStorageEngine]
    _image_store: Final[ImageStore]

    def __init__(
        self, domain_storage_engine: DomainStorageEngine, image_store: ImageStore
    ) -> None:
        """Constructor."""
        self._domain_storage_engine = domain_storage_engine
        self._image_store = image_store

    async def do_it(self, user_ref_id: EntityId) -> None:
        """Remove the objects."""
        # Not held open across the calls to the store.
        async with self._domain_storage_engine.get_unit_of_work() as uow:
            images = await uow.get_for(Image).find_all(
                parent_ref_id=user_ref_id, allow_archived=True
            )

        for image in images:
            await self._image_store.remove(image.purpose, image.store_path)
