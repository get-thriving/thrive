"""Remove the object of an image the database has let go of."""

import logging
from typing import Final

from jupiter.core.common.sub.images.image_store import ImageStore
from jupiter.core.common.sub.images.sub.image.image_path import ImagePath
from jupiter.core.common.sub.images.sub.image.image_purpose import ImagePurpose

LOGGER = logging.getLogger(__name__)


class RemoveStoredImageService:
    """Remove the object of an image the database has let go of.

    By the time this runs the row is gone, so failing to remove the object is
    no reason to fail whatever the caller was doing. It is logged, and an object
    left behind is for the cleanup job (ADR 0018) to find.
    """

    _image_store: Final[ImageStore]

    def __init__(self, image_store: ImageStore) -> None:
        """Constructor."""
        self._image_store = image_store

    async def do_it(self, purpose: ImagePurpose, path: ImagePath) -> None:
        """Remove the object, and never raise."""
        try:
            await self._image_store.remove(purpose, path)
        except Exception:
            LOGGER.exception(
                "Could not remove the %s image at %s; it is left behind", purpose, path
            )
