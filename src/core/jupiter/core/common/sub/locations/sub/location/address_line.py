"""A free-form address line for a location."""

from functools import total_ordering

from jupiter.framework.errors import InputValidationError
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, hashable_value


@hashable_value
@total_ordering
class AddressLine(AtomicValue[str]):
    """A free-form address line."""

    the_address: str

    @staticmethod
    def from_raw(the_address: str) -> "AddressLine":
        """Construct from a raw string."""
        cleaned_address = " ".join(
            word for word in the_address.strip().split(" ") if len(word) > 0
        )
        if len(cleaned_address) == 0:
            raise InputValidationError("Expected address line to be non-empty")
        return AddressLine(cleaned_address)

    def __lt__(self, other: object) -> bool:
        """Compare this with another."""
        if not isinstance(other, AddressLine):
            raise Exception(
                f"Cannot compare an address line with {other.__class__.__name__}",
            )
        return self.the_address < other.the_address

    def __str__(self) -> str:
        """Transform this to a string version."""
        return self.the_address


class AddressLineDatabaseEncoder(PrimitiveAtomicValueDatabaseEncoder[AddressLine]):
    """Encode to a database primitive."""

    def to_primitive(self, value: AddressLine) -> str:
        """Encode to a database primitive."""
        return value.the_address


class AddressLineDatabaseDecoder(PrimitiveAtomicValueDatabaseDecoder[AddressLine]):
    """Decode from a database primitive."""

    def from_raw_str(self, primitive: str) -> AddressLine:
        """Decode from a raw string."""
        return AddressLine.from_raw(primitive)
