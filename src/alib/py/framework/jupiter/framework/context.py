"""A domain-level context for calls that are made."""

from dataclasses import dataclass

from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.component_properties import ComponentProperties


@dataclass(frozen=True)
class MutationContext:
    """A context for the series of mutations that are performed."""

    trace_id: TraceId
    mutation_id: MutationId
    event_source: str
    action_timestamp: Timestamp

    @staticmethod
    def build(
        component_properties: ComponentProperties,
        trace_id: TraceId,
        action_timestamp: Timestamp,
    ) -> "MutationContext":
        """Create a mutation context from an app."""
        from rich import print
        print(f"Building mutation context for trace id: {trace_id} and mutation id: {MutationId.new()}")
        return MutationContext(
            trace_id=trace_id,
            mutation_id=MutationId.new(),
            event_source=component_properties.as_event_source(),
            action_timestamp=action_timestamp,
        )
