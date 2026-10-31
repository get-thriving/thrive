"""The store images live in, wherever that may be."""

import abc
from collections.abc import AsyncIterator

from jupiter.core.common.sub.images.sub.image.image_link import ImageLink
from jupiter.core.common.sub.images.sub.image.image_path import ImagePath
from jupiter.core.common.sub.images.sub.image.image_purpose import ImagePurpose
from jupiter.core.common.sub.images.sub.image.stored_image import StoredImage
from jupiter.core.common.sub.images.sub.image.stored_image_info import StoredImageInfo
from jupiter.framework.storage.repository import EntityNotFoundError, Repository


class ImageNotFoundError(EntityNotFoundError):
    """Raised when the store has no image at a path.

    An entity not found error, so that the WebAPI answers it with a 404.
    """


class ImageStore(Repository, abc.ABC):
    """The store images live in, wherever that may be.

    Images are addressed by purpose and path. A store belongs to one instance
    and never sees the images of another, even when they share a bucket.
    It is only a place for bytes: what to keep, how to size it and who may
    see it are decided by the callers.
    """

    @abc.abstractmethod
    async def put(
        self, purpose: ImagePurpose, path: ImagePath, image: StoredImage
    ) -> None:
        """Save an image, replacing any image already at the path."""

    @abc.abstractmethod
    async def load(self, purpose: ImagePurpose, path: ImagePath) -> StoredImage:
        """Load an image, or raise ImageNotFoundError."""

    @abc.abstractmethod
    async def remove(self, purpose: ImagePurpose, path: ImagePath) -> None:
        """Remove an image. Removing one that isn't there is not an error."""

    @abc.abstractmethod
    def list_images(self, purpose: ImagePurpose) -> AsyncIterator[StoredImageInfo]:
        """List every image of this instance and purpose, in no set order."""

    @abc.abstractmethod
    async def get_serving_link(
        self, purpose: ImagePurpose, path: ImagePath
    ) -> ImageLink:
        """Get a link a browser can fetch the image from.

        Does not check the image exists. Where the link points is up to the
        store: a public bucket directly, or the WebUI for stores a browser
        can't reach.
        """
