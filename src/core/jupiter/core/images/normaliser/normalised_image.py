"""A picture, as we keep it."""

from dataclasses import dataclass

from jupiter.core.images.image_content_hash import ImageContentHash
from jupiter.core.images.store.image_content_type import ImageContentType
from jupiter.core.images.store.stored_image import StoredImage


@dataclass(frozen=True)
class NormalisedImage:
    """A picture, as we keep it.

    Not a domain value: it carries raw bytes.
    """

    content: bytes
    content_type: ImageContentType
    content_hash: ImageContentHash
    width: int
    height: int

    @property
    def size_in_bytes(self) -> int:
        """How many bytes it takes."""
        return len(self.content)

    def as_stored_image(self) -> StoredImage:
        """The same, in the shape the image store takes."""
        return StoredImage(self.content, self.content_type)
