"""A search query parameter for searches."""

from jupiter.framework.errors import InputValidationError
from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, value


@value
class SearchQuery(AtomicValue[str]):
    """A search query parameter for searches."""

    the_query: str

    def __str__(self) -> str:
        """Transform this to a string version."""
        return str(self.the_query)


class SearchQueryDatabaseEncoder(PrimitiveAtomicValueDatabaseEncoder[SearchQuery]):
    """Encode to a database primitive."""

    def to_primitive(self, value: SearchQuery) -> Primitive:
        """Encode to a primitive."""
        return value.the_query


class SearchQueryDatabaseDecoder(PrimitiveAtomicValueDatabaseDecoder[SearchQuery]):
    """Decode from a database primitive."""

    def from_raw_str(self, primitive: str) -> SearchQuery:
        """Decode from a raw string."""
        query_nows = primitive.strip()

        if len(query_nows) == 0:
            raise InputValidationError("Expected query to be non empty.")

        return SearchQuery(query_nows)
