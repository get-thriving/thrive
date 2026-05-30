"""A system URL used for internal callbacks and similar flows."""

from functools import total_ordering

import validators
from jupiter.framework.errors import InputValidationError
from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, value


@value
@total_ordering
class SystemUrl(AtomicValue[str]):
    """A system URL that may point at localhost."""

    the_url: str

    def __lt__(self, other: object) -> bool:
        """Compare this with another."""
        if not isinstance(other, SystemUrl):
            raise Exception(
                f"Cannot compare a SystemUrl with {other.__class__.__name__}"
            )
        return self.the_url < other.the_url

    def __str__(self) -> str:
        """Transform this to a string version."""
        return self.the_url


class SystemUrlDatabaseEncoder(PrimitiveAtomicValueDatabaseEncoder[SystemUrl]):
    """Encode to a database primitive."""

    def to_primitive(self, value: SystemUrl) -> Primitive:
        """Encode to a database primitive."""
        return value.the_url


class SystemUrlDatabaseDecoder(PrimitiveAtomicValueDatabaseDecoder[SystemUrl]):
    """Decode from a database primitive."""

    def from_raw_str(self, value: str) -> SystemUrl:
        """Decode from a raw string."""
        url_str: str = value.strip()

        validation_result = validators.url(url_str)
        if validation_result is not True:
            validation_result = validators.url(url_str, simple_host=True)
        if validation_result is not True:
            raise InputValidationError(f"Invalid system URL '{value}'")
        return SystemUrl(url_str)
