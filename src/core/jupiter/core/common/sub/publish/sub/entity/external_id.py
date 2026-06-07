"""External id for publish entities."""

import uuid

from jupiter.framework.errors import InputValidationError
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, hashable_value


@hashable_value
class PublishExternalId(AtomicValue[str]):
    """A GUID external id for a publish entity."""

    the_id: str

    def _validate(self) -> None:
        try:
            uuid.UUID(self.the_id, version=4)
        except (ValueError, TypeError) as err:
            raise InputValidationError(
                "Publish external id must be a valid UUID v4"
            ) from err

    @staticmethod
    def new_external_id() -> "PublishExternalId":
        """Construct a new external id."""
        return PublishExternalId(str(uuid.uuid4()))

    def __str__(self) -> str:
        """The string representation."""
        return self.the_id


class PublishExternalIdDatabaseEncoder(
    PrimitiveAtomicValueDatabaseEncoder[PublishExternalId]
):
    """Encode to a database primitive."""

    def to_primitive(self, value: PublishExternalId) -> str:
        """Encode to a database primitive."""
        return value.the_id


class PublishExternalIdDatabaseDecoder(
    PrimitiveAtomicValueDatabaseDecoder[PublishExternalId]
):
    """Decode from a database primitive."""

    def from_raw_str(self, primitive: str) -> PublishExternalId:
        """Decode from a raw string."""
        return PublishExternalId(primitive)
