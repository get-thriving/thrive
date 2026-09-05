"""An ISO 3166-1 alpha-2 country code."""

import re
from functools import total_ordering
from typing import Final

from jupiter.framework.errors import InputValidationError
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, hashable_value

_COUNTRY_CODE_RE: Final[re.Pattern[str]] = re.compile(r"^[A-Z]{2}$")


@hashable_value
@total_ordering
class CountryCode(AtomicValue[str]):
    """An ISO 3166-1 alpha-2 country code."""

    the_code: str

    @staticmethod
    def from_raw(the_code: str) -> "CountryCode":
        """Construct from a raw string."""
        return CountryCode(the_code.strip().upper())

    def _validate(self) -> None:
        """Validate this value."""
        if not _COUNTRY_CODE_RE.match(self.the_code):
            raise InputValidationError(
                f"Expected country code '{self.the_code}' to be an ISO 3166-1 alpha-2 code",
            )

    def __lt__(self, other: object) -> bool:
        """Compare this with another."""
        if not isinstance(other, CountryCode):
            raise Exception(
                f"Cannot compare a country code with {other.__class__.__name__}",
            )
        return self.the_code < other.the_code

    def __str__(self) -> str:
        """Transform this to a string version."""
        return self.the_code


class CountryCodeDatabaseEncoder(PrimitiveAtomicValueDatabaseEncoder[CountryCode]):
    """Encode to a database primitive."""

    def to_primitive(self, value: CountryCode) -> str:
        """Encode to a database primitive."""
        return value.the_code


class CountryCodeDatabaseDecoder(PrimitiveAtomicValueDatabaseDecoder[CountryCode]):
    """Decode from a database primitive."""

    def from_raw_str(self, primitive: str) -> CountryCode:
        """Decode from a raw string."""
        return CountryCode.from_raw(primitive)
