"""Plain (decrypted) Apple refresh token — never persisted."""

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
class AppleRefreshTokenPlain(SecretValue):
    """An Apple OAuth refresh token in plain form. Never stored."""

    token_raw: str


class AppleRefreshTokenPlainWebEncoder(RealmEncoder[AppleRefreshTokenPlain, WebRealm]):
    """Encode a plain Apple refresh token for the Web API."""

    def encode(self, value: AppleRefreshTokenPlain) -> RealmThing:
        """Encode to a Web API primitive."""
        return value.token_raw


class AppleRefreshTokenPlainWebDecoder(RealmDecoder[AppleRefreshTokenPlain, WebRealm]):
    """Decode a plain Apple refresh token from the Web API."""

    def decode(self, value: RealmThing) -> AppleRefreshTokenPlain:
        """Decode from a Web API primitive."""
        if not isinstance(value, str):
            raise RealmDecodingError(
                f"Expected Apple refresh token to be a string, got {value}"
            )
        return AppleRefreshTokenPlain(value)
