"""Plain (decrypted) Google refresh token — never persisted."""

from jupiter.framework.realm.realm import (
    RealmDecoder,
    RealmDecodingError,
    RealmEncoder,
    RealmThing,
    WebRealm,
    only_in_realm,
)
from jupiter.framework.value import SecretValue, secret_value


@secret_value
@only_in_realm(WebRealm)
class GoogleRefreshTokenPlain(SecretValue):
    """A Google OAuth refresh token in plain form. Never stored."""

    token_raw: str


class GoogleRefreshTokenPlainWebEncoder(
    RealmEncoder[GoogleRefreshTokenPlain, WebRealm]
):
    """Encode a plain Google refresh token for the Web API."""

    def encode(self, value: GoogleRefreshTokenPlain) -> RealmThing:
        """Encode to a Web API primitive."""
        return value.token_raw


class GoogleRefreshTokenPlainWebDecoder(
    RealmDecoder[GoogleRefreshTokenPlain, WebRealm]
):
    """Decode a plain Google refresh token from the Web API."""

    def decode(self, value: RealmThing) -> GoogleRefreshTokenPlain:
        """Decode from a Web API primitive."""
        if not isinstance(value, str):
            raise RealmDecodingError(
                f"Expected Google refresh token to be a string, got {value}"
            )
        return GoogleRefreshTokenPlain(value)
