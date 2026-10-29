"""An image store in Google Cloud Storage."""

import asyncio
import logging
from collections.abc import AsyncIterator, Mapping
from dataclasses import dataclass
from typing import Final

import pendulum
from google.api_core.exceptions import NotFound
from google.cloud import storage
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

# Every image lives at a path nobody has seen before, and is never rewritten, so
# browsers and caches can hold on to it for good.
_CACHE_CONTROL: Final[str] = "public, max-age=31536000, immutable"
_DEFAULT_PUBLIC_BASE_URL: Final[str] = "https://storage.googleapis.com"


@dataclass(frozen=True)
class GcsImageBucket:
    """Where the images of a purpose live."""

    name: str
    # Where the bucket is served from. Empty for the plain Google URL of the
    # bucket, set to put a CDN or a custom domain in front of it.
    public_base_url: str = ""

    @property
    def effective_public_base_url(self) -> str:
        """Where the bucket is served from, without a trailing slash."""
        if self.public_base_url:
            return self.public_base_url.rstrip("/")
        return f"{_DEFAULT_PUBLIC_BASE_URL}/{self.name}"


class GcsImageStore(ImageStore):
    """An image store in Google Cloud Storage.

    Each purpose has its own bucket, and an instance keeps its images under a
    prefix of its own, since instances of an environment share the bucket.
    The buckets are public, and links go straight to them: the unguessable path
    of an image is what keeps it private.
    """

    def __init__(
        self,
        client: storage.Client,
        buckets: Mapping[ImagePurpose, GcsImageBucket],
        instance: Instance,
    ) -> None:
        """Constructor."""
        self._client = client
        self._buckets = buckets
        self._namespace = instance_namespace(instance)

    async def put(
        self, purpose: ImagePurpose, path: ImagePath, image: StoredImage
    ) -> None:
        """Save an image, replacing any image already at the path."""
        await asyncio.to_thread(self._upload, purpose, path, image)

    async def load(self, purpose: ImagePurpose, path: ImagePath) -> StoredImage:
        """Load an image, or raise ImageNotFoundError."""
        try:
            content = await asyncio.to_thread(
                self._blob(purpose, path).download_as_bytes
            )
        except NotFound:
            raise ImageNotFoundError(f"No {purpose} image at '{path}'") from None
        return StoredImage(content, path.content_type)

    async def remove(self, purpose: ImagePurpose, path: ImagePath) -> None:
        """Remove an image. Removing one that isn't there is not an error."""
        try:
            await asyncio.to_thread(self._blob(purpose, path).delete)
        except NotFound:
            pass

    async def list_images(
        self, purpose: ImagePurpose
    ) -> AsyncIterator[StoredImageInfo]:
        """List every image of this instance and purpose, in no set order."""
        prefix = f"{self._namespace}/"
        # The listing is blocking and fetches a page of results at a time as it
        # is iterated, so every step of it goes off the event loop.
        blobs = iter(
            self._client.list_blobs(self._bucket_for(purpose).name, prefix=prefix)
        )
        while True:
            blob = await asyncio.to_thread(next, blobs, None)
            if blob is None:
                return
            try:
                path = ImagePath(blob.name.removeprefix(prefix))
            except InputValidationError:
                LOGGER.warning(
                    "Ignoring unexpected object %s in the %s bucket", blob.name, purpose
                )
                continue
            yield StoredImageInfo(
                path=path,
                size_in_bytes=blob.size,
                created_time=Timestamp.from_date_and_time(
                    pendulum.instance(blob.time_created)
                ),
            )

    async def get_serving_link(
        self, purpose: ImagePurpose, path: ImagePath
    ) -> ImageLink:
        """Get the public link of the image in its bucket."""
        base_url = self._bucket_for(purpose).effective_public_base_url
        return ImageLink(
            url=ImageUrl(f"{base_url}/{self._namespace}/{path.the_path}"),
            expires_at=None,
        )

    def _bucket_for(self, purpose: ImagePurpose) -> GcsImageBucket:
        """The bucket of a purpose."""
        try:
            return self._buckets[purpose]
        except KeyError:
            raise ValueError(f"No bucket configured for {purpose} images") from None

    def _blob(self, purpose: ImagePurpose, path: ImagePath) -> storage.Blob:
        """The object an image lives in."""
        bucket = self._client.bucket(self._bucket_for(purpose).name)
        return bucket.blob(f"{self._namespace}/{path.the_path}")

    def _upload(
        self, purpose: ImagePurpose, path: ImagePath, image: StoredImage
    ) -> None:
        """Upload an image."""
        blob = self._blob(purpose, path)
        blob.cache_control = _CACHE_CONTROL
        blob.upload_from_string(image.content, content_type=image.content_type.value)
