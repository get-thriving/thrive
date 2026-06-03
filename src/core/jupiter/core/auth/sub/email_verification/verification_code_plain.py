"""A verification code in plain text, as received from a user."""

import secrets
from typing import Final

from jupiter.framework.errors import InputValidationError
from jupiter.framework.realm.realm import (
    CliRealm,
    EventStoreRealm,
    RealmDecoder,
    RealmEncoder,
    RealmThing,
    WebRealm,
    only_in_realm,
)
from jupiter.framework.value import SecretValue, secret_value

_VERIFICATION_CODE_LENGTH: Final[int] = 6


@secret_value
@only_in_realm(CliRealm, WebRealm, EventStoreRealm)
class VerificationCodePlain(SecretValue):
    """A verification code in plain text, as received from a user."""

    code_raw: str

    @staticmethod
    def generate() -> "VerificationCodePlain":
        """Generate a random 6 digit verification code."""
        code = str(secrets.randbelow(10**_VERIFICATION_CODE_LENGTH)).zfill(
            _VERIFICATION_CODE_LENGTH
        )
        return VerificationCodePlain(code)


class VerificationCodePlainCliDecoder(RealmDecoder[VerificationCodePlain, CliRealm]):
    """Decode a verification code plain from the CLI."""

    def decode(self, value: RealmThing) -> VerificationCodePlain:
        """Decode a verification code plain from the CLI."""
        if not isinstance(value, str):
            raise InputValidationError(
                f"Expected verification code plain to be a string, got {value}"
            )

        return VerificationCodePlain(value)


class VerificationCodePlainWebDecoder(RealmDecoder[VerificationCodePlain, WebRealm]):
    """Decode a verification code plain from the Web."""

    def decode(self, value: RealmThing) -> VerificationCodePlain:
        """Decode a verification code plain from the Web."""
        if not isinstance(value, str):
            raise InputValidationError(
                f"Expected verification code plain to be a string, got {value}"
            )

        return VerificationCodePlain(value)


class VerificationCodePlainEventStoreRealmEncoder(
    RealmEncoder[VerificationCodePlain, EventStoreRealm]
):
    """Encode a verification code plain for storage in the Event Store."""

    def encode(self, value: VerificationCodePlain) -> RealmThing:
        """Encode a verification code plain for storage in the Event Store."""
        return "******"
