"""An image store that does nothing but throw."""

from collections.abc import AsyncIterator

from jupiter.core.common.sub.images.image_store import ImageStore
from jupiter.core.common.sub.images.sub.image.image_link import ImageLink
from jupiter.core.common.sub.images.sub.image.image_path import ImagePath
from jupiter.core.common.sub.images.sub.image.image_purpose import ImagePurpose
from jupiter.core.common.sub.images.sub.image.stored_image import StoredImage
from jupiter.core.common.sub.images.sub.image.stored_image_info import StoredImageInfo


class NoOpImageStore(ImageStore):
    """An image store that does nothing but throw.

    For the apps that never touch images, so that one reaching for them anyway
    fails loudly rather than quietly writing somewhere nobody looks.
    """

    async def put(
        self, purpose: ImagePurpose, path: ImagePath, image: StoredImage
    ) -> None:
        """Throw."""
        raise Exception("This app has no image store")

    async def load(self, purpose: ImagePurpose, path: ImagePath) -> StoredImage:
        """Throw."""
        raise Exception("This app has no image store")

    async def remove(self, purpose: ImagePurpose, path: ImagePath) -> None:
        """Throw."""
        raise Exception("This app has no image store")

    def list_images(self, purpose: ImagePurpose) -> AsyncIterator[StoredImageInfo]:
        """Throw."""
        raise Exception("This app has no image store")

    async def get_serving_link(
        self, purpose: ImagePurpose, path: ImagePath
    ) -> ImageLink:
        """Throw."""
        raise Exception("This app has no image store")
