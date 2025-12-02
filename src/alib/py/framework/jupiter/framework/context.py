"""A domain-level context for calls that are made."""

import uuid
from dataclasses import dataclass

from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.component_properties import ComponentProperties


@dataclass(frozen=True)
class MutationContext:
    """A context for the series of mutations that are performed."""

    mutation_id: str
    event_source: str
    action_timestamp: Timestamp

    @staticmethod
    def build(
        component_properties: ComponentProperties,
        action_timestamp: Timestamp,
    ) -> "MutationContext":
        """Create a mutation context from an app."""
        return MutationContext(
            mutation_id=str(uuid.uuid4()),
            event_source=component_properties.as_event_source(),
            action_timestamp=action_timestamp,
        )
