"""An image store on the local disk."""

import asyncio
import logging
import os
import tempfile
from collections.abc import AsyncIterator
from pathlib import Path

from jupiter.core.images.store.image_link import ImageLink
from jupiter.core.images.store.image_not_found_error import ImageNotFoundError
from jupiter.core.images.store.image_path import ImagePath
from jupiter.core.images.store.image_purpose import ImagePurpose
from jupiter.core.images.store.image_store import ImageStore
from jupiter.core.images.store.image_url import ImageUrl
from jupiter.core.images.store.instance_namespace import instance_namespace
from jupiter.core.images.store.stored_image import StoredImage
from jupiter.core.images.store.stored_image_info import StoredImageInfo
from jupiter.core.instance import Instance
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.errors import InputValidationError

LOGGER = logging.getLogger(__name__)


class LocalImageStore(ImageStore):
    """An image store on the local disk.

    Images sit at ``<root>/<purpose>/<instance namespace>/<path>``. A browser
    can't read the disk, so links point at the ``/images`` route of the WebUI,
    which loads the image through the WebAPI. Those links are relative, so they
    resolve against whichever server the app is connected to.
    """

    def __init__(self, root: Path, instance: Instance) -> None:
        """Constructor."""
        self._root = root
        self._namespace = instance_namespace(instance)

    async def put(
        self, purpose: ImagePurpose, path: ImagePath, image: StoredImage
    ) -> None:
        """Save an image, replacing any image already at the path."""
        await asyncio.to_thread(self._write, self._file_for(purpose, path), image)

    async def load(self, purpose: ImagePurpose, path: ImagePath) -> StoredImage:
        """Load an image, or raise ImageNotFoundError."""
        try:
            content = await asyncio.to_thread(self._file_for(purpose, path).read_bytes)
        except (FileNotFoundError, IsADirectoryError, NotADirectoryError):
            raise ImageNotFoundError(f"No {purpose} image at '{path}'") from None
        return StoredImage(content, path.content_type)

    async def remove(self, purpose: ImagePurpose, path: ImagePath) -> None:
        """Remove an image. Removing one that isn't there is not an error."""
        try:
            await asyncio.to_thread(self._file_for(purpose, path).unlink)
        except (FileNotFoundError, NotADirectoryError):
            pass

    async def list_images(
        self, purpose: ImagePurpose
    ) -> AsyncIterator[StoredImageInfo]:
        """List every image of this instance and purpose, in no set order.

        The time of an image is when it was last written, which is when it was
        created: paths are random, so nothing is ever rewritten in place.
        """
        for info in await asyncio.to_thread(self._scan, self._dir_for(purpose)):
            yield info

    async def get_serving_link(
        self, purpose: ImagePurpose, path: ImagePath
    ) -> ImageLink:
        """Get a link to the WebUI route that serves the image."""
        return ImageLink(
            url=ImageUrl(f"/images/{purpose.value}/{path.the_path}"),
            expires_at=None,
        )

    def _dir_for(self, purpose: ImagePurpose) -> Path:
        """The directory holding this instance's images of a purpose."""
        return self._root / purpose.value / self._namespace

    def _file_for(self, purpose: ImagePurpose, path: ImagePath) -> Path:
        """The file an image lives in."""
        base = self._dir_for(purpose).resolve()
        target = (base / path.the_path).resolve()
        # ImagePath already rules out '..', but a symlink could still lead out.
        if not target.is_relative_to(base):
            raise ValueError(f"Image path '{path}' leads out of the store")
        return target

    @staticmethod
    def _write(target: Path, image: StoredImage) -> None:
        """Write an image so that readers never see half of it."""
        target.parent.mkdir(parents=True, exist_ok=True)
        file_descriptor, temp_name = tempfile.mkstemp(
            dir=target.parent, prefix=".", suffix=".tmp"
        )
        try:
            with os.fdopen(file_descriptor, "wb") as temp_file:
                temp_file.write(image.content)
            Path(temp_name).replace(target)
        except BaseException:
            Path(temp_name).unlink(missing_ok=True)
            raise

    @staticmethod
    def _scan(base: Path) -> list[StoredImageInfo]:
        """Find all the images under a directory."""
        infos: list[StoredImageInfo] = []
        for directory, _, file_names in os.walk(base):
            for file_name in file_names:
                if file_name.startswith("."):
                    # An upload in flight.
                    continue
                file = Path(directory) / file_name
                try:
                    path = ImagePath(file.relative_to(base).as_posix())
                except InputValidationError:
                    LOGGER.warning(
                        "Ignoring unexpected file %s in the image store", file
                    )
                    continue
                try:
                    file_stat = file.stat()
                except FileNotFoundError:
                    # Removed since we listed the directory.
                    continue
                infos.append(
                    StoredImageInfo(
                        path=path,
                        size_in_bytes=file_stat.st_size,
                        created_time=Timestamp.from_unix_timestamp(
                            int(file_stat.st_mtime)
                        ),
                    )
                )
        return infos
