"""AES-encrypted Apple refresh token, suitable for database storage."""

from cryptography.fernet import Fernet
from jupiter.core.auth.sub.apple.refresh_token_plain import AppleRefreshTokenPlain
from jupiter.framework.realm.realm import (
    DatabaseRealm,
    RealmDecoder,
    RealmDecodingError,
    RealmEncoder,
    RealmThing,
    only_in_realm,
)
from jupiter.framework.value import SecretValue, secret_value


@secret_value
@only_in_realm(DatabaseRealm)
class AppleRefreshTokenEncrypted(SecretValue):
    """An AES-encrypted Apple OAuth refresh token."""

    token_encrypted: str

    @staticmethod
    def from_plain(
        plain: AppleRefreshTokenPlain, key: str
    ) -> "AppleRefreshTokenEncrypted":
        """Encrypt a plain refresh token."""
        f = Fernet(key)
        return AppleRefreshTokenEncrypted(f.encrypt(plain.token_raw.encode()).decode())

    def to_plain(self, key: str) -> AppleRefreshTokenPlain:
        """Decrypt back to plain."""
        f = Fernet(key)
        return AppleRefreshTokenPlain(f.decrypt(self.token_encrypted.encode()).decode())


class AppleRefreshTokenEncryptedDatabaseEncoder(
    RealmEncoder[AppleRefreshTokenEncrypted, DatabaseRealm]
):
    """Encode an encrypted refresh token for database storage."""

    def encode(self, value: AppleRefreshTokenEncrypted) -> RealmThing:
        """Encode to a database primitive."""
        return value.token_encrypted


class AppleRefreshTokenEncryptedDatabaseDecoder(
    RealmDecoder[AppleRefreshTokenEncrypted, DatabaseRealm]
):
    """Decode an encrypted refresh token from database storage."""

    def decode(self, value: RealmThing) -> AppleRefreshTokenEncrypted:
        """Decode from a database primitive."""
        if not isinstance(value, str):
            raise RealmDecodingError(f"Expected str, got {value}")
        return AppleRefreshTokenEncrypted(value)
