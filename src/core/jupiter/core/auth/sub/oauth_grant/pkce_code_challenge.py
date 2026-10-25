"""The PKCE code challenge (RFC 7636): the S256 fingerprint of a verifier."""

import base64
import hashlib
import hmac
import re
from typing import Final

from jupiter.core.auth.sub.oauth_grant.pkce_code_verifier import PkceCodeVerifier
from jupiter.framework.errors import InputValidationError
from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, value

# The S256 challenge is the base64url of a SHA-256 digest, without padding.
_CHALLENGE_RE: Final[re.Pattern[str]] = re.compile(r"^[A-Za-z0-9_-]{43}$")


@value
class PkceCodeChallenge(AtomicValue[str]):
    """The S256 fingerprint of a verifier, which the client sends up front."""

    the_challenge: str

    def _validate(self) -> None:
        """Validate this value."""
        if not _CHALLENGE_RE.match(self.the_challenge):
            raise InputValidationError(
                "A code challenge must be 43 base64url characters (S256)"
            )

    @staticmethod
    def from_verifier(verifier: PkceCodeVerifier) -> "PkceCodeChallenge":
        """The S256 challenge for a verifier."""
        digest = hashlib.sha256(verifier.verifier_raw.encode("ascii")).digest()
        return PkceCodeChallenge(
            base64.urlsafe_b64encode(digest).rstrip(b"=").decode("ascii")
        )

    def matches(self, verifier: PkceCodeVerifier) -> bool:
        """Whether the verifier is the one this challenge was made from."""
        return hmac.compare_digest(
            PkceCodeChallenge.from_verifier(verifier).the_challenge,
            self.the_challenge,
        )

    def __str__(self) -> str:
        """Transform this to a string version."""
        return self.the_challenge


class PkceCodeChallengeDatabaseEncoder(
    PrimitiveAtomicValueDatabaseEncoder[PkceCodeChallenge]
):
    """Encode to a database primitive."""

    def to_primitive(self, value: PkceCodeChallenge) -> Primitive:
        """Encode to a primitive."""
        return value.the_challenge


class PkceCodeChallengeDatabaseDecoder(
    PrimitiveAtomicValueDatabaseDecoder[PkceCodeChallenge]
):
    """Decode from a database primitive."""

    def from_raw_str(self, value: str) -> PkceCodeChallenge:
        """Decode from a raw str."""
        return PkceCodeChallenge(value)
