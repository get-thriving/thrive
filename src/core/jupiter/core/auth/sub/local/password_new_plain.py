"""A new password in plain text, as received from a user."""

import re
from re import Pattern
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

_PASSWORD_PLAIN_RE: Final[Pattern[str]] = re.compile(r"^\S+$")
_PASSWORD_MIN_LENGTH: Final[int] = 10


@secret_value
@only_in_realm(CliRealm, WebRealm, EventStoreRealm)
class PasswordNewPlain(SecretValue):
    """A new password in plain text, as received from a user."""

    password_raw: str

    @staticmethod
    def from_raw(password_raw: str) -> "PasswordNewPlain":
        """Create a password new plain from a raw string."""
        if not _PASSWORD_PLAIN_RE.match(password_raw):
            raise InputValidationError("Invalid password raw")

        if len(password_raw) < _PASSWORD_MIN_LENGTH:
            raise InputValidationError(
                f"Expected password to be longer than {_PASSWORD_MIN_LENGTH} characters"
            )
        return PasswordNewPlain(password_raw)


class PasswordNewPlainCliDecoder(RealmDecoder[PasswordNewPlain, CliRealm]):
    """Decode a password newplain from storage in the CLI."""

    def decode(self, value: RealmThing) -> PasswordNewPlain:
        """Decode a password newplain from storage in the database."""
        if not isinstance(value, str):
            raise InputValidationError(
                f"Expected password newplain to be a string, got {value}"
            )

        return PasswordNewPlain.from_raw(value)


class PasswordNewPlainWebDecoder(RealmDecoder[PasswordNewPlain, WebRealm]):
    """Decode a password newplain from storage in the Web."""

    def decode(self, value: RealmThing) -> PasswordNewPlain:
        """Decode a password newplain from storage in the database."""
        if not isinstance(value, str):
            raise InputValidationError(
                f"Expected password newplain to be a string, got {value}"
            )

        return PasswordNewPlain.from_raw(value)


class PasswordNewPlainEventStoreRealmEncoder(
    RealmEncoder[PasswordNewPlain, EventStoreRealm]
):
    """Encode a password newplain for storage in the Event Store."""

    def encode(self, value: PasswordNewPlain) -> RealmThing:
        """Encode a password newplain for storage in the Event Store."""
        return "***********"
