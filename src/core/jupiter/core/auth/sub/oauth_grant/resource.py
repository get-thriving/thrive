"""The resource an OAuth grant gives access to."""

from urllib.parse import urlsplit

from jupiter.framework.errors import InputValidationError
from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, value


@value
class OAuthResource(AtomicValue[str]):
    """The resource an OAuth grant gives access to.

    This is the resource indicator from RFC 8707: the URL of the server the
    access is for, such as the MCP endpoint. The client names it when it asks for
    access, and the grant is tied to it so the access cannot be used for another
    server.
    """

    the_resource: str

    def _validate(self) -> None:
        """Validate this value."""
        parts = urlsplit(self.the_resource)
        if parts.scheme not in ("http", "https") or not parts.netloc:
            raise InputValidationError("A resource must be an absolute http(s) URL")
        if parts.fragment:
            raise InputValidationError("A resource must not have a fragment")

    def __str__(self) -> str:
        """Transform this to a string version."""
        return self.the_resource


class OAuthResourceDatabaseEncoder(PrimitiveAtomicValueDatabaseEncoder[OAuthResource]):
    """Encode to a database primitive."""

    def to_primitive(self, value: OAuthResource) -> Primitive:
        """Encode to a primitive."""
        return value.the_resource


class OAuthResourceDatabaseDecoder(PrimitiveAtomicValueDatabaseDecoder[OAuthResource]):
    """Decode from a database primitive."""

    def from_raw_str(self, value: str) -> OAuthResource:
        """Decode from a raw str."""
        return OAuthResource(value)
