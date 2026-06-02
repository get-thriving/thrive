"""A hashed verification code, suitable for storage."""

import argon2.profiles
from argon2 import PasswordHasher

from jupiter.core.auth.sub.email_verification.verification_code_plain import (
    VerificationCodePlain,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.realm.realm import (
    DatabaseRealm,
    EventStoreRealm,
    RealmDecoder,
    RealmEncoder,
    RealmThing,
    only_in_realm,
)
from jupiter.framework.value import SecretValue, secret_value

_PROFILE = argon2.profiles.RFC_9106_LOW_MEMORY
_HASHER = PasswordHasher.from_parameters(_PROFILE)


@secret_value
@only_in_realm(DatabaseRealm, EventStoreRealm)
class VerificationCodeHash(SecretValue):
    """A hashed verification code, suitable for storage."""

    code_hash_raw: str

    @staticmethod
    def from_plain(plain: VerificationCodePlain) -> "VerificationCodeHash":
        """Build a hashed verification code from a plain code."""
        return VerificationCodeHash(_HASHER.hash(plain.code_raw))

    def check_against(self, plain: VerificationCodePlain) -> bool:
        """Check that a plain code matches this hash."""
        try:
            _HASHER.verify(self.code_hash_raw, plain.code_raw)
            return True
        except argon2.exceptions.VerifyMismatchError:
            return False


class VerificationCodeHashDatabaseEncoder(
    RealmEncoder[VerificationCodeHash, DatabaseRealm]
):
    """Encode a verification code hash for storage in the database."""

    def encode(self, value: VerificationCodeHash) -> RealmThing:
        """Encode a verification code hash for storage in the database."""
        return value.code_hash_raw


class VerificationCodeHashDatabaseDecoder(
    RealmDecoder[VerificationCodeHash, DatabaseRealm]
):
    """Decode a verification code hash from storage in the database."""

    def decode(self, value: RealmThing) -> VerificationCodeHash:
        """Decode a verification code hash from storage in the database."""
        if not isinstance(value, str):
            raise InputValidationError(
                f"Expected verification code hash to be a string, got {value}"
            )
        try:
            params = argon2.extract_parameters(value)
        except argon2.exceptions.InvalidHash as err:
            raise InputValidationError(
                "Hashed verification code does not match expected format"
            ) from err
        if params != _PROFILE:
            raise InputValidationError(
                "Hashed verification code parameters do not match standard profile"
            )
        return VerificationCodeHash(value)


class VerificationCodeHashEventStoreEncoder(
    RealmEncoder[VerificationCodeHash, EventStoreRealm]
):
    """Redact the verification code hash in event store output."""

    def encode(self, value: VerificationCodeHash) -> RealmThing:
        """Redact the hash."""
        return "***********"
