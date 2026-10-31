"""Remove the objects of every image an owner has from the image store."""

from typing import Final

from jupiter.core.common.sub.images.image_store import ImageStore
from jupiter.core.common.sub.images.sub.image.root import Image
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainStorageEngine


class RemoveOwnerImageObjectsService:
    """Remove the objects of every image an owner has from the image store.

    The rows are left alone: they are removed with ``RemoveOwnerImageRowsService``
    when the owner is destroyed, or stay if the owner is only archived. An owner
    is destroyed in the database and the store knows nothing of that, so the
    objects have to be removed on the side. Strict, as there is no one else to
    find the objects afterwards: if the store fails, the caller learns of it, and
    can choose to try again or to leave them.
    """

    _domain_storage_engine: Final[DomainStorageEngine]
    _image_store: Final[ImageStore]

    def __init__(
        self, domain_storage_engine: DomainStorageEngine, image_store: ImageStore
    ) -> None:
        """Constructor."""
        self._domain_storage_engine = domain_storage_engine
        self._image_store = image_store

    async def do_it(self, owner: EntityLink) -> None:
        """Remove the objects."""
        # Not held open across the calls to the store.
        async with self._domain_storage_engine.get_unit_of_work() as uow:
            images = await uow.get_for(Image).find_all_generic(
                owner=owner, allow_archived=True
            )

        for image in images:
            await self._image_store.remove(image.purpose, image.store_path)
