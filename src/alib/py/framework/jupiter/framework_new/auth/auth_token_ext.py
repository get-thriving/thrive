"""An externally facing authentication token."""

import re
from re import Pattern
from typing import Final

from jupiter.framework_new.realm.realm import (
    DatabaseRealm,
    RealmDecoder,
    RealmDecodingError,
    RealmEncoder,
    RealmThing,
)
from jupiter.framework_new.secure import secure_class
from jupiter.framework_new.value import AtomicValue, value

_JWT_RE: Final[Pattern[str]] = re.compile(
    r"([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)"
)


@value
@secure_class
class AuthTokenExt(AtomicValue[str]):
    """An externally facing authentication token."""

    auth_token_str: str


class AuthTokenExtDatabaseEncoder(RealmEncoder[AuthTokenExt, DatabaseRealm]):
    """Encode to a database primitive."""

    def encode(self, value: AuthTokenExt) -> RealmThing:
        """Encode to a database realm."""
        return value.auth_token_str


class AuthTokenExtDatabaseDecoder(RealmDecoder[AuthTokenExt, DatabaseRealm]):
    """Decode from a database primitive."""

    def decode(self, value: RealmThing) -> AuthTokenExt:
        """Decode from a datanbase value."""
        if not isinstance(value, str):
            raise RealmDecodingError(
                f"Expected value for {self.__class__} to be string but was {value.__class__}"
            )

        return AuthTokenExt(value)
