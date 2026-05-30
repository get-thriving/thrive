"""Google OAuth subject ID — the stable 'sub' claim from Google's ID token."""

from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, value


@value
class GoogleSubjectId(AtomicValue[str]):
    """The Google subject ID for a user."""

    the_value: str


class GoogleSubjectIdDatabaseEncoder(
    PrimitiveAtomicValueDatabaseEncoder[GoogleSubjectId]
):
    """Encode to a database primitive."""

    def to_primitive(self, value: GoogleSubjectId) -> Primitive:
        """Encode to a primitive."""
        return value.the_value


class GoogleSubjectIdDatabaseDecoder(
    PrimitiveAtomicValueDatabaseDecoder[GoogleSubjectId]
):
    """Decode from a database primitive."""

    def from_raw_str(self, value: str) -> GoogleSubjectId:
        """Decode from a raw str."""
        return GoogleSubjectId(value)
