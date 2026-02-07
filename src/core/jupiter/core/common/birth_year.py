"""The birth year of a person."""

from typing import Final

from jupiter.framework.errors import InputValidationError
from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, value

_MIN_BIRTH_YEAR: Final[int] = 1900
_MAX_BIRTH_YEAR: Final[int] = 2100


@value
class BirthYear(AtomicValue[int]):
    """The birth year of a person."""

    the_year: int

    @staticmethod
    def build(year: int) -> "BirthYear":
        """Construct a new birth year."""
        if year <= _MIN_BIRTH_YEAR or year >= _MAX_BIRTH_YEAR:
            raise InputValidationError(f"Birth year is out of bounds with value {year}")
        return BirthYear(year)

    def __str__(self) -> str:
        """Transform this to a string version."""
        return str(self.the_year)


class BirthYearDatabaseEncoder(PrimitiveAtomicValueDatabaseEncoder[BirthYear]):
    """Encode to a database primitive."""

    def to_primitive(self, value: BirthYear) -> Primitive:
        """Encode to a primitive."""
        return value.the_year


class BirthYearDatabaseDecoder(PrimitiveAtomicValueDatabaseDecoder[BirthYear]):
    """Decode from a database primitive."""

    def from_raw_int(self, value: int) -> BirthYear:
        """Decode from a raw int."""
        return BirthYear.build(value)
