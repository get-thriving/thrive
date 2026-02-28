"""A plain secret, part of an API key."""

import re
import secrets

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


@secret_value
@only_in_realm(WebRealm, EventStoreRealm)
class KeySecretPlain(SecretValue):
    """A plain secret, part of an API key."""

    secret_raw: str

    @staticmethod
    def from_raw(secret_raw: str) -> "KeySecretPlain":
        """Create a secret plain from a raw string."""
        if not re.fullmatch(r"[0-9a-f]{32}", secret_raw):
            raise InputValidationError("Invalid secret raw")

        return KeySecretPlain(secret_raw)

    @staticmethod
    def generate() -> "KeySecretPlain":
        """Generate a new secret plain."""
        return KeySecretPlain(secrets.token_hex(16))

    @property
    def last_four_digits(self) -> str:
        """Get the last four digits of the secret."""
        return self.secret_raw[-4:]


class KeySecretPlainWebDecoder(RealmDecoder[KeySecretPlain, WebRealm]):
    """Decode a secret plain from storage in the Web."""

    def decode(self, value: RealmThing) -> KeySecretPlain:
        """Decode a secret plain from storage in the database."""
        if not isinstance(value, str):
            raise RealmDecodingError(
                f"Expected secret plain to be a string, got {value}"
            )

        return KeySecretPlain(value)


class KeySecretPlainEventStoreRealmEncoder(
    RealmEncoder[KeySecretPlain, EventStoreRealm]
):
    """Encode a secret plain for storage in the Event Store."""

    def encode(self, value: KeySecretPlain) -> RealmThing:
        """Encode a secret plain for storage in the Event Store."""
        return "*" * 32
