"""The content type of a stored image."""

from jupiter.framework.errors import InputValidationError
from jupiter.framework.value import EnumValue, enum_value


@enum_value
class ImageContentType(EnumValue):
    """The content type of a stored image.

    The store only ever holds images we normalised ourselves, so this lists
    the formats we write rather than the ones we accept.
    """

    WEBP = "image/webp"

    @property
    def file_extension(self) -> str:
        """The file extension used for this content type, without the dot."""
        if self == ImageContentType.WEBP:
            return "webp"
        raise Exception(f"Unexpected content type {self}")

    @staticmethod
    def from_file_extension(file_extension: str) -> "ImageContentType":
        """Find the content type for a file extension, without the dot."""
        for content_type in ImageContentType:
            if content_type.file_extension == file_extension:
                return content_type
        raise InputValidationError(f"Unknown image file extension '{file_extension}'")
