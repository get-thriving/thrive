"""The hash of the bytes of a stored image."""

import hashlib
import re
from typing import Final

from jupiter.framework.errors import InputValidationError
from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, hashable_value

_SHA256_HEX: Final[re.Pattern[str]] = re.compile(r"[0-9a-f]{64}")


@hashable_value
class ImageContentHash(AtomicValue[str]):
    """The SHA-256 of the bytes of a stored image, in hex.

    Lets a refresh from a social login tell that the picture is the one we
    already hold, and skip storing it again.
    """

    the_hash: str

    @staticmethod
    def from_content(content: bytes) -> "ImageContentHash":
        """Hash the bytes of an image."""
        return ImageContentHash(hashlib.sha256(content).hexdigest())

    def _validate(self) -> None:
        """Validate this hash."""
        if not _SHA256_HEX.fullmatch(self.the_hash):
            raise InputValidationError("Expected image content hash to be a SHA-256")

    def __str__(self) -> str:
        """Transform this to a string version."""
        return self.the_hash


class ImageContentHashDatabaseEncoder(
    PrimitiveAtomicValueDatabaseEncoder[ImageContentHash]
):
    """Encode to a database primitive."""

    def to_primitive(self, value: ImageContentHash) -> Primitive:
        """Encode to a database primitive."""
        return value.the_hash


class ImageContentHashDatabaseDecoder(
    PrimitiveAtomicValueDatabaseDecoder[ImageContentHash]
):
    """Decode from a database primitive."""

    def from_raw_str(self, value: str) -> ImageContentHash:
        """Decode from a raw string."""
        return ImageContentHash(value)
