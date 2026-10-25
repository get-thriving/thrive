"""The PKCE code verifier (RFC 7636): the secret a client shows to redeem its code."""

import re
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

_VERIFIER_RE: Final[re.Pattern[str]] = re.compile(r"^[A-Za-z0-9\-._~]{43,128}$")


@secret_value
@only_in_realm(WebRealm, EventStoreRealm)
class PkceCodeVerifier(SecretValue):
    """The secret a client makes up when it starts, and shows when it redeems its code."""

    verifier_raw: str

    def __post_init__(self) -> None:
        """Validate this value."""
        if not _VERIFIER_RE.match(self.verifier_raw):
            raise InputValidationError(
                "A code verifier must be 43 to 128 unreserved characters"
            )


class PkceCodeVerifierWebDecoder(RealmDecoder[PkceCodeVerifier, WebRealm]):
    """Decode a code verifier from the Web."""

    def decode(self, value: RealmThing) -> PkceCodeVerifier:
        """Decode a code verifier from the Web."""
        if not isinstance(value, str):
            raise RealmDecodingError("Expected a code verifier string")
        try:
            return PkceCodeVerifier(value)
        except InputValidationError as err:
            raise RealmDecodingError(str(err)) from err


class PkceCodeVerifierEventStoreRealmEncoder(
    RealmEncoder[PkceCodeVerifier, EventStoreRealm]
):
    """Encode a code verifier for the Event Store, without leaking it."""

    def encode(self, value: PkceCodeVerifier) -> RealmThing:
        """Encode a code verifier for the Event Store, without leaking it."""
        return "*" * 16
