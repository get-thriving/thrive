"""AES-encrypted Google refresh token, suitable for database storage."""

from cryptography.fernet import Fernet
from jupiter.core.auth.sub.google.refresh_token_plain import (
    GoogleRefreshTokenPlain,
)
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
class GoogleRefreshTokenEncrypted(SecretValue):
    """An AES-encrypted Google OAuth refresh token."""

    token_encrypted: str

    @staticmethod
    def from_plain(
        plain: GoogleRefreshTokenPlain, key: str
    ) -> "GoogleRefreshTokenEncrypted":
        """Encrypt a plain refresh token."""
        f = Fernet(key)
        return GoogleRefreshTokenEncrypted(f.encrypt(plain.token_raw.encode()).decode())

    def to_plain(self, key: str) -> GoogleRefreshTokenPlain:
        """Decrypt back to plain."""
        f = Fernet(key)
        return GoogleRefreshTokenPlain(
            f.decrypt(self.token_encrypted.encode()).decode()
        )


class GoogleRefreshTokenEncryptedDatabaseEncoder(
    RealmEncoder[GoogleRefreshTokenEncrypted, DatabaseRealm]
):
    """Encode an encrypted refresh token for database storage."""

    def encode(self, value: GoogleRefreshTokenEncrypted) -> RealmThing:
        """Encode to a database primitive."""
        return value.token_encrypted


class GoogleRefreshTokenEncryptedDatabaseDecoder(
    RealmDecoder[GoogleRefreshTokenEncrypted, DatabaseRealm]
):
    """Decode an encrypted refresh token from database storage."""

    def decode(self, value: RealmThing) -> GoogleRefreshTokenEncrypted:
        """Decode from a database primitive."""
        if not isinstance(value, str):
            raise RealmDecodingError(f"Expected str, got {value}")
        return GoogleRefreshTokenEncrypted(value)
