"""The stored hash of the random secret behind an OAuth code or refresh token."""

import argon2
import argon2.exceptions
import argon2.profiles
from argon2 import PasswordHasher
from jupiter.core.auth.sub.oauth_grant.oauth_secret_plain import OAuthSecretPlain
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
_HASHER = PasswordHasher.from_parameters(_PROFILE)


@secret_value
@only_in_realm(DatabaseRealm)
class OAuthSecretHash(SecretValue):
    """The stored hash of an OAuth secret."""

    hash_raw: str

    @staticmethod
    def from_plain(plain: OAuthSecretPlain) -> "OAuthSecretHash":
        """Hash a secret for storage."""
        return OAuthSecretHash(_HASHER.hash(plain.secret_raw))

    def check_against(self, plain: OAuthSecretPlain) -> bool:
        """Whether the secret is the one this hash was made from."""
        try:
            _HASHER.verify(self.hash_raw, plain.secret_raw)
            return True
        except argon2.exceptions.VerifyMismatchError:
            return False


class OAuthSecretHashDatabaseEncoder(RealmEncoder[OAuthSecretHash, DatabaseRealm]):
    """Encode an OAuth secret hash for the database."""

    def encode(self, value: OAuthSecretHash) -> RealmThing:
        """Encode an OAuth secret hash for the database."""
        return value.hash_raw


class OAuthSecretHashDatabaseDecoder(RealmDecoder[OAuthSecretHash, DatabaseRealm]):
    """Decode an OAuth secret hash from the database."""

    def decode(self, value: RealmThing) -> OAuthSecretHash:
        """Decode an OAuth secret hash from the database."""
        if not isinstance(value, str):
            raise InputValidationError(
                f"Expected an OAuth secret hash to be a string, got {value}"
            )

        try:
            params = argon2.extract_parameters(value)
        except argon2.exceptions.InvalidHash as err:
            raise InputValidationError(
                "OAuth secret hash does not match the expected format"
            ) from err

        if params != _PROFILE:
            raise InputValidationError(
                "OAuth secret hash parameters do not match the standard profile"
            )

        return OAuthSecretHash(value)
