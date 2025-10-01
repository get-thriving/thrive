"""A domain-level context for calls that are made."""

from dataclasses import dataclass

from jupiter.framework_new.base.timestamp import Timestamp
from jupiter.framework_new.component_properties import ComponentProperties


@dataclass(frozen=True)
class DomainContext:
    """A domain-level context for calls that are made."""

    event_source: str
    action_timestamp: Timestamp

    @staticmethod
    def build(
        component_properties: ComponentProperties,
        action_timestamp: Timestamp,
    ) -> "DomainContext":
        """Create a domain context from an app."""
        return DomainContext(
            event_source=component_properties.as_event_source(),
            action_timestamp=action_timestamp,
        )
