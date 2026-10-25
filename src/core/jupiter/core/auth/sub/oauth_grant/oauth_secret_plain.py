"""The random secret behind an OAuth code or refresh token, in plain text."""

import re
import secrets
from typing import Final

from jupiter.framework.errors import InputValidationError
from jupiter.framework.realm.realm import (
    EventStoreRealm,
    RealmDecoder,
    RealmDecodingError,
    RealmEncoder,
    RealmThing,
    WebRealm,
    only_in_realm,
)
from jupiter.framework.value import SecretValue, secret_value

_SECRET_RE: Final[re.Pattern[str]] = re.compile(r"^[0-9a-f]{32}$")


@secret_value
@only_in_realm(WebRealm, EventStoreRealm)
class OAuthSecretPlain(SecretValue):
    """The random secret behind an OAuth code or refresh token, in plain text."""

    secret_raw: str

    def __post_init__(self) -> None:
        """Validate this value."""
        if not _SECRET_RE.match(self.secret_raw):
            raise InputValidationError("An OAuth secret must be 32 hex characters")

    @staticmethod
    def generate() -> "OAuthSecretPlain":
        """Make a new random secret."""
        return OAuthSecretPlain(secrets.token_hex(16))


class OAuthSecretPlainWebDecoder(RealmDecoder[OAuthSecretPlain, WebRealm]):
    """Decode an OAuth secret from the Web."""

    def decode(self, value: RealmThing) -> OAuthSecretPlain:
        """Decode an OAuth secret from the Web."""
        if not isinstance(value, str):
            raise RealmDecodingError("Expected an OAuth secret string")
        try:
            return OAuthSecretPlain(value)
        except InputValidationError as err:
            raise RealmDecodingError(str(err)) from err


class OAuthSecretPlainEventStoreRealmEncoder(
    RealmEncoder[OAuthSecretPlain, EventStoreRealm]
):
    """Encode an OAuth secret for the Event Store, without leaking it."""

    def encode(self, value: OAuthSecretPlain) -> RealmThing:
        """Encode an OAuth secret for the Event Store, without leaking it."""
        return "*" * 32
