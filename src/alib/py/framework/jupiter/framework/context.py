"""A domain-level context for calls that are made."""

from dataclasses import dataclass

from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.component_properties import ComponentProperties


@dataclass
class DomainContext:
    """A context for the series of mutations that are performed."""

    trace_id: TraceId
    mutation_id: MutationId
    event_source: str
    action_timestamp: Timestamp
    _context_str: str

    @staticmethod
    def build_with_no_context_str(
        component_properties: ComponentProperties,
        trace_id: TraceId,
        action_timestamp: Timestamp,
    ) -> "DomainContext":
        """Create a mutation context from an app."""
        return DomainContext(
            trace_id=trace_id,
            mutation_id=MutationId.new(),
            event_source=component_properties.as_event_source(),
            action_timestamp=action_timestamp,
            _context_str="system",
        )

    def _set_context_str(self, context_str: str) -> None:
        """Set the context string of the context."""
        self._context_str = context_str

    @property
    def context_str(self) -> str:
        """The string representation of the context."""
        return self._context_str
