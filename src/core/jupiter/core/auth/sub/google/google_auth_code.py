"""Short-lived Google OAuth secrets (authorisation code, access token). Never stored."""

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


@secret_value
@only_in_realm(WebRealm, EventStoreRealm)
class GoogleAuthCode(SecretValue):
    """A Google OAuth authorisation code or access token. Never stored."""

    code_raw: str


class GoogleAuthCodeWebEncoder(RealmEncoder[GoogleAuthCode, WebRealm]):
    """Encode a Google auth code for the Web API."""

    def encode(self, value: GoogleAuthCode) -> RealmThing:
        """Encode to a Web API primitive."""
        return value.code_raw


class GoogleAuthCodeWebDecoder(RealmDecoder[GoogleAuthCode, WebRealm]):
    """Decode a Google auth code from the Web API."""

    def decode(self, value: RealmThing) -> GoogleAuthCode:
        """Decode from a Web API primitive."""
        if not isinstance(value, str):
            raise RealmDecodingError(
                f"Expected Google auth code to be a string, got {value}"
            )
        if not value:
            raise RealmDecodingError("Expected Google auth code to be non-empty")
        return GoogleAuthCode(value)


class GoogleAuthCodeEventStoreRealmEncoder(
    RealmEncoder[GoogleAuthCode, EventStoreRealm]
):
    """Encode a Google auth code for storage in the Event Store."""

    def encode(self, value: GoogleAuthCode) -> RealmThing:
        """Encode a Google auth code for storage in the Event Store."""
        return "***********"
