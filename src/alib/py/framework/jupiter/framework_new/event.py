"""Framework level elements for entity events."""

import enum
from dataclasses import dataclass

from jupiter.framework_new.base.timestamp import Timestamp
from jupiter.framework_new.realm import DomainThing


@enum.unique
class EventKind(enum.Enum):
    """The kind of an event."""

    CREATE = "Created"
    UPDATE = "Updated"
    ARCHIVE = "Archived"


@dataclass(frozen=True)
class Event:
    """An event for an entity."""

    source: str
    entity_version: int
    timestamp: Timestamp
    frame_args: dict[str, tuple[DomainThing, type[DomainThing]]]
    kind: EventKind
    name: str
