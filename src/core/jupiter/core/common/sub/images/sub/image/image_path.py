"""The path of an image inside the store of a purpose."""

import re
import secrets
from typing import Final

from jupiter.core.common.sub.images.sub.image.image_content_type import ImageContentType
from jupiter.framework.errors import InputValidationError
from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, hashable_value

_MAX_LENGTH: Final[int] = 255
_RANDOM_NAME_BYTES: Final[int] = 24
# Lowercase only, so a case-insensitive filesystem can't merge two images.
# A segment can't start with a dot and a dot is always followed by something,
# which rules out '.', '..' and hidden files.
_SEGMENT: Final[str] = r"[a-z0-9][a-z0-9_-]*(?:\.[a-z0-9_-]+)*"
_PATH_PATTERN: Final[re.Pattern[str]] = re.compile(rf"{_SEGMENT}(?:/{_SEGMENT})*")


@hashable_value
class ImagePath(AtomicValue[str]):
    """The path of an image inside the store of a purpose.

    A relative path of lowercase segments, ending in a known image extension.
    These end up in file names and URLs, so anything else is rejected here
    rather than trusted further down.
    """

    the_path: str

    @staticmethod
    def new_random(content_type: ImageContentType) -> "ImagePath":
        """Generate a path nobody can guess.

        The store serves images without checking who asks, so the secrecy of
        the link is the only protection: 192 bits of randomness.
        """
        return ImagePath(
            f"{secrets.token_hex(_RANDOM_NAME_BYTES)}.{content_type.file_extension}"
        )

    @property
    def content_type(self) -> ImageContentType:
        """The content type, as given by the extension."""
        return ImageContentType.from_file_extension(self._file_extension)

    @property
    def _file_extension(self) -> str:
        """The extension of the last segment, without the dot."""
        file_name = self.the_path.rsplit("/", 1)[-1]
        return file_name.rsplit(".", 1)[-1] if "." in file_name else ""

    def _validate(self) -> None:
        """Validate this path."""
        if len(self.the_path) > _MAX_LENGTH:
            raise InputValidationError(
                f"Expected image path to be at most {_MAX_LENGTH} characters"
            )
        if not _PATH_PATTERN.fullmatch(self.the_path):
            raise InputValidationError(f"Invalid image path '{self.the_path}'")
        # Only paths ending in an extension we know how to serve are valid.
        ImageContentType.from_file_extension(self._file_extension)

    def __str__(self) -> str:
        """Transform this to a string version."""
        return self.the_path


class ImagePathDatabaseEncoder(PrimitiveAtomicValueDatabaseEncoder[ImagePath]):
    """Encode to a database primitive."""

    def to_primitive(self, value: ImagePath) -> Primitive:
        """Encode to a database primitive."""
        return value.the_path


class ImagePathDatabaseDecoder(PrimitiveAtomicValueDatabaseDecoder[ImagePath]):
    """Decode from a database primitive."""

    def from_raw_str(self, value: str) -> ImagePath:
        """Decode from a raw string."""
        return ImagePath(value)
