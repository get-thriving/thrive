"""What the store knows about an image, without its bytes."""

from dataclasses import dataclass

from jupiter.core.images.store.image_path import ImagePath
from jupiter.framework.base.timestamp import Timestamp


@dataclass(frozen=True)
class StoredImageInfo:
    """What the store knows about an image, without its bytes."""

    path: ImagePath
    size_in_bytes: int
    created_time: Timestamp
