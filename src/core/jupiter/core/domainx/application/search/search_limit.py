"""A search limit parameter for searches."""

from jupiter.framework.errors import InputValidationError
from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, value

_MAX_QUERY_LIMIT = 1000


@value
class SearchLimit(AtomicValue[int]):
    """A search limit parameter for searches."""

    the_limit: int

    def __str__(self) -> str:
        """Transform this to a string version."""
        return str(self.the_limit)


class SearchLimitDatabaseEncoder(PrimitiveAtomicValueDatabaseEncoder[SearchLimit]):
    """Encode to a database primitive."""

    def to_primitive(self, value: SearchLimit) -> Primitive:
        """Encode to a primitive."""
        return value.the_limit


class SearchLimitDatabaseDecoder(PrimitiveAtomicValueDatabaseDecoder[SearchLimit]):
    """Decode from a database primitive."""

    def from_raw_int(self, value: int) -> SearchLimit:
        """Decode from a raw int."""
        if value < 1:
            raise InputValidationError("Expected limit to be a positive number")

        if value > _MAX_QUERY_LIMIT:
            raise InputValidationError(
                f"Expected limit to be smaller than {_MAX_QUERY_LIMIT}"
            )

        return SearchLimit(value)
