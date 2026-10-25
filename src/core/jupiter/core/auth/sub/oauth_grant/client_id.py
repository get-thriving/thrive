"""The identifier an OAuth client uses to identify itself."""

import re
from typing import Final

from jupiter.framework.errors import InputValidationError
from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, value

_CLIENT_ID_RE: Final[re.Pattern[str]] = re.compile(r"^[\x21-\x7e]{1,2048}$")


@value
class OAuthClientId(AtomicValue[str]):
    """The identifier an OAuth client uses to identify itself.

    For apps that describe themselves this is the URL of their metadata document.
    Until those documents are fetched, any visible text without spaces is allowed.
    """

    the_client_id: str

    def _validate(self) -> None:
        """Validate this value."""
        if not _CLIENT_ID_RE.match(self.the_client_id):
            raise InputValidationError(
                "A client id must be 1 to 2048 visible characters, without spaces"
            )

    def __str__(self) -> str:
        """Transform this to a string version."""
        return self.the_client_id


class OAuthClientIdDatabaseEncoder(PrimitiveAtomicValueDatabaseEncoder[OAuthClientId]):
    """Encode to a database primitive."""

    def to_primitive(self, value: OAuthClientId) -> Primitive:
        """Encode to a primitive."""
        return value.the_client_id


class OAuthClientIdDatabaseDecoder(PrimitiveAtomicValueDatabaseDecoder[OAuthClientId]):
    """Decode from a database primitive."""

    def from_raw_str(self, value: str) -> OAuthClientId:
        """Decode from a raw str."""
        return OAuthClientId(value)
