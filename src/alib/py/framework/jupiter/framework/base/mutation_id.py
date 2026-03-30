"""A mutation id for a particular user action."""

import re
import uuid

from jupiter.framework.realm.realm import (
    DatabaseRealm,
    RealmDecoder,
    RealmDecodingError,
    RealmEncoder,
    RealmThing,
)
from jupiter.framework.value import AtomicValue, value

_MUTATION_ID_RE: re.Pattern[str] = re.compile(
    r"^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$|^bad-mutation-id$"
)


@value
class MutationId(AtomicValue[str]):
    """A mutation id for a particular user action."""

    the_mutation_id: str

    @staticmethod
    def new() -> "MutationId":
        """Create a new mutation id."""
        return MutationId(str(uuid.uuid4()))


class MutationIdDatabaseEncoder(RealmEncoder[MutationId, DatabaseRealm]):
    """Encoder for mutation ids in the database."""

    def encode(self, value: MutationId) -> RealmThing:
        """Encode a mutation id to a database realm."""
        return value.the_mutation_id


class MutationIdDatabaseDecoder(RealmDecoder[MutationId, DatabaseRealm]):
    """Decoder for mutation ids in the database."""

    def decode(self, value: RealmThing) -> MutationId:
        """Decode a mutation id from a database realm."""
        if not isinstance(value, str):
            raise RealmDecodingError(
                f"Expected value for {self.__class__} to be a string but was {value}"
            )
        if not _MUTATION_ID_RE.match(value):
            raise RealmDecodingError(
                f"Expected value for {self.__class__} to be a valid mutation id but was {value}"
            )
        return MutationId(value)
