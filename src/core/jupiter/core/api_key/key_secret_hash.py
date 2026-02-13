"""A hash of a secret for an API key."""

import argon2
from argon2 import PasswordHasher
from jupiter.core.api_key.key_secret_plain import KeySecretPlain
from jupiter.framework.errors import InputValidationError
from jupiter.framework.realm.realm import (
    DatabaseRealm,
    RealmDecoder,
    RealmEncoder,
    RealmThing,
    only_in_realm,
)
from jupiter.framework.value import SecretValue, secret_value

_PROFILE = argon2.profiles.RFC_9106_LOW_MEMORY
_SECRET_HASHER = PasswordHasher.from_parameters(_PROFILE)


@secret_value
@only_in_realm(DatabaseRealm)
class KeySecretHash(SecretValue):
    """A hash of a secret for an API key."""

    hash_raw: str

    @staticmethod
    def from_raw(secret_hash_str: str | None) -> "KeySecretHash":
        """Validate and clean a raw secret hash."""
        if not secret_hash_str:
            raise InputValidationError("Expected secret hash to be non-null")

        try:
            secret_hash_params = argon2.extract_parameters(secret_hash_str)
        except argon2.exceptions.InvalidHash as err:
            raise InputValidationError(
                "Secret hash does not match expected format"
            ) from err

        if secret_hash_params != _PROFILE:
            raise InputValidationError(
                "Secret hash parameters do not match standard profile"
            )

        return KeySecretHash(secret_hash_str)

    @staticmethod
    def from_plain(plain: KeySecretPlain) -> "KeySecretHash":
        """Build a secret hash from a plain secret."""
        return KeySecretHash(_SECRET_HASHER.hash(plain.secret_raw))

    def check_against(self, plain: KeySecretPlain) -> bool:
        """Check that the given secret and this one match."""
        try:
            _SECRET_HASHER.verify(self.hash_raw, plain.secret_raw)
            return True
        except argon2.exceptions.VerifyMismatchError:
            return False


class KeySecretHashDatabaseEncoder(RealmEncoder[KeySecretHash, DatabaseRealm]):
    """Encode a secret hash for storage in the database."""

    def encode(self, value: KeySecretHash) -> RealmThing:
        """Encode a secret hash for storage in the database."""
        return value.hash_raw


class KeySecretHashDatabaseDecoder(RealmDecoder[KeySecretHash, DatabaseRealm]):
    """Decode a secret hash from storage in the database."""

    def decode(self, value: RealmThing) -> KeySecretHash:
        """Decode a secret hash from storage in the database."""
        if not isinstance(value, str):
            raise InputValidationError(
                f"Expected secret hash to be a string, got {value}"
            )
        return KeySecretHash.from_raw(value)
