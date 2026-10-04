"""Short-lived Apple OAuth secrets (authorisation code, access token). Never stored."""

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
class AppleAuthCode(SecretValue):
    """An Apple OAuth authorisation code or access token. Never stored."""

    code_raw: str


class AppleAuthCodeWebEncoder(RealmEncoder[AppleAuthCode, WebRealm]):
    """Encode an Apple auth code for the Web API."""

    def encode(self, value: AppleAuthCode) -> RealmThing:
        """Encode to a Web API primitive."""
        return value.code_raw


class AppleAuthCodeWebDecoder(RealmDecoder[AppleAuthCode, WebRealm]):
    """Decode an Apple auth code from the Web API."""

    def decode(self, value: RealmThing) -> AppleAuthCode:
        """Decode from a Web API primitive."""
        if not isinstance(value, str):
            raise RealmDecodingError(
                f"Expected Apple auth code to be a string, got {value}"
            )
        if not value:
            raise RealmDecodingError("Expected Apple auth code to be non-empty")
        return AppleAuthCode(value)


class AppleAuthCodeEventStoreRealmEncoder(RealmEncoder[AppleAuthCode, EventStoreRealm]):
    """Encode an Apple auth code for storage in the Event Store."""

    def encode(self, value: AppleAuthCode) -> RealmThing:
        """Encode an Apple auth code for storage in the Event Store."""
        return "***********"
