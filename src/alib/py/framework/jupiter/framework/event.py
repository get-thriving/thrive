"""Framework level elements for entity events."""

import enum
from dataclasses import dataclass

from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.realm.realm import DomainThing


@enum.unique
class EventKind(enum.Enum):
    """The kind of an event."""

    CREATE = "Created"
    UPDATE = "Updated"
    ARCHIVE = "Archived"
    REMOVED = "Removed"

    @property
    def is_removed(self) -> bool:
        """Check if the event is a removal event."""
        return self == EventKind.REMOVED


@dataclass(frozen=True)
class Event:
    """An event for an entity."""

    trace_id: TraceId
    mutation_id: MutationId
    source: str
    entity_version: int
    timestamp: Timestamp
    frame_args: dict[str, tuple[DomainThing, type[DomainThing]]]
    kind: EventKind
    name: str
    context_str: str
