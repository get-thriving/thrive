"""Framework level elements for entity events."""

from dataclasses import dataclass

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.event import EventKind


@dataclass(frozen=True)
class MutationEntityEvent:
    """The record of the modification of an entity."""

    entity_type: str
    entity_ref_id: EntityId
    entity_version: int
    kind: EventKind
    name: str
    trace_id: TraceId
    mutation_id: MutationId
    timestamp: Timestamp
    session_index: int
    source: str
    context_str: str
