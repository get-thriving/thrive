"""A link an image can be fetched from."""

from jupiter.framework.errors import InputValidationError
from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, hashable_value


@hashable_value
class ImageUrl(AtomicValue[str]):
    """A link an image can be fetched from.

    Either absolute (a public bucket) or relative to the origin the page was
    served from (``/images/...``, the WebUI serves those). The relative form
    keeps the local store free of host and port settings: the browser resolves
    it against whatever server the app is talking to.
    """

    the_url: str

    @property
    def is_relative(self) -> bool:
        """Whether this link needs resolving against the page's origin."""
        return self.the_url.startswith("/")

    def _validate(self) -> None:
        """Validate this link."""
        absolute = self.the_url.startswith(("https://", "http://"))
        # '//host/path' is protocol-relative, which is neither of the two.
        relative = self.the_url.startswith("/") and not self.the_url.startswith("//")
        if not absolute and not relative:
            raise InputValidationError(f"Invalid image url '{self.the_url}'")

    def __str__(self) -> str:
        """Transform this to a string version."""
        return self.the_url


class ImageUrlDatabaseEncoder(PrimitiveAtomicValueDatabaseEncoder[ImageUrl]):
    """Encode to a database primitive."""

    def to_primitive(self, value: ImageUrl) -> Primitive:
        """Encode to a database primitive."""
        return value.the_url


class ImageUrlDatabaseDecoder(PrimitiveAtomicValueDatabaseDecoder[ImageUrl]):
    """Decode from a database primitive."""

    def from_raw_str(self, value: str) -> ImageUrl:
        """Decode from a raw string."""
        return ImageUrl(value)
