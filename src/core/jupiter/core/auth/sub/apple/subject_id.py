"""Apple OAuth subject ID — the stable 'sub' claim from Apple's ID token."""

from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, value


@value
class AppleSubjectId(AtomicValue[str]):
    """The Apple subject ID for a user."""

    the_value: str


class AppleSubjectIdDatabaseEncoder(
    PrimitiveAtomicValueDatabaseEncoder[AppleSubjectId]
):
    """Encode to a database primitive."""

    def to_primitive(self, value: AppleSubjectId) -> Primitive:
        """Encode to a primitive."""
        return value.the_value


class AppleSubjectIdDatabaseDecoder(
    PrimitiveAtomicValueDatabaseDecoder[AppleSubjectId]
):
    """Decode from a database primitive."""

    def from_raw_str(self, value: str) -> AppleSubjectId:
        """Decode from a raw str."""
        return AppleSubjectId(value)
