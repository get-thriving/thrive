"""A verification code in plain text, as generated or received from a user."""

import random

from jupiter.framework.errors import InputValidationError
from jupiter.framework.realm.realm import (
    EventStoreRealm,
    RealmDecoder,
    RealmEncoder,
    RealmThing,
    WebRealm,
    only_in_realm,
)
from jupiter.framework.value import SecretValue, secret_value

_CODE_LENGTH = 6
_CODE_DIGITS = "0123456789"


@secret_value
@only_in_realm(WebRealm, EventStoreRealm)
class VerificationCodePlain(SecretValue):
    """A verification code in plain text."""

    code_raw: str

    @staticmethod
    def new_verification_code() -> "VerificationCodePlain":
        """Generate a new random numeric verification code."""
        code = "".join(random.choices(_CODE_DIGITS, k=_CODE_LENGTH))
        return VerificationCodePlain(code)


class VerificationCodePlainWebDecoder(RealmDecoder[VerificationCodePlain, WebRealm]):
    """Decode a verification code from a web request."""

    def decode(self, value: RealmThing) -> VerificationCodePlain:
        """Decode a verification code from a web request."""
        if not isinstance(value, str):
            raise InputValidationError(
                f"Expected verification code to be a string, got {value}"
            )
        if len(value) != _CODE_LENGTH or not value.isdigit():
            raise InputValidationError(
                f"Verification code must be exactly {_CODE_LENGTH} digits"
            )
        return VerificationCodePlain(value)


class VerificationCodePlainEventStoreRealmEncoder(
    RealmEncoder[VerificationCodePlain, EventStoreRealm]
):
    """Encode a verification code for the event store (redacted)."""

    def encode(self, value: VerificationCodePlain) -> RealmThing:
        """Redact the plain code in event store output."""
        return "***********"
