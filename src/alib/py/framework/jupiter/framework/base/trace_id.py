"""A trace id for a particular user action."""

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

_TRACE_ID_RE: re.Pattern[str] = re.compile(
    r"^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$|^bad-trace-id$"
)


@value
class TraceId(AtomicValue[str]):
    """A trace id for a particular user action."""

    the_trace_id: str

    @staticmethod
    def new() -> "TraceId":
        """Create a new trace id."""
        return TraceId(str(uuid.uuid4()))


class TraceIdDatabaseEncoder(RealmEncoder[TraceId, DatabaseRealm]):
    """Encoder for trace ids in the database."""

    def encode(self, value: TraceId) -> RealmThing:
        """Encode a trace id to a database realm."""
        return value.the_trace_id


class TraceIdDatabaseDecoder(RealmDecoder[TraceId, DatabaseRealm]):
    """Decoder for trace ids in the database."""

    def decode(self, value: RealmThing) -> TraceId:
        """Decode a trace id from a database realm."""
        if not isinstance(value, str):
            raise RealmDecodingError(
                f"Expected value for {self.__class__} to be a string but was {value}"
            )
        if not _TRACE_ID_RE.match(value):
            raise RealmDecodingError(
                f"Expected value for {self.__class__} to be a valid trace id but was {value}"
            )
        return TraceId(value)
