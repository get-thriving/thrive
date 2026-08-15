"""A search offset parameter for paginated searches."""

from jupiter.framework.errors import InputValidationError
from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, value

_MAX_SEARCH_OFFSET = 1_000_000


@value
class SearchOffset(AtomicValue[int]):
    """A search offset parameter for paginated searches."""

    the_offset: int

    def __str__(self) -> str:
        """Transform this to a string version."""
        return str(self.the_offset)


class SearchOffsetDatabaseEncoder(PrimitiveAtomicValueDatabaseEncoder[SearchOffset]):
    """Encode to a database primitive."""

    def to_primitive(self, value: SearchOffset) -> Primitive:
        """Encode to a primitive."""
        return value.the_offset


class SearchOffsetDatabaseDecoder(PrimitiveAtomicValueDatabaseDecoder[SearchOffset]):
    """Decode from a database primitive."""

    def from_raw_int(self, value: int) -> SearchOffset:
        """Decode from a raw int."""
        if value < 0:
            raise InputValidationError("Expected offset to be non negative")

        if value > _MAX_SEARCH_OFFSET:
            raise InputValidationError(
                f"Expected offset to be at most {_MAX_SEARCH_OFFSET}"
            )

        return SearchOffset(value)
