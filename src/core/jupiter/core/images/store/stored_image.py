"""An image as it sits in the store."""

from dataclasses import dataclass

from jupiter.core.images.store.image_content_type import ImageContentType


@dataclass(frozen=True)
class StoredImage:
    """An image as it sits in the store.

    Not a domain value: it carries raw bytes, so it is never persisted or sent
    through the API as is.
    """

    content: bytes
    content_type: ImageContentType
