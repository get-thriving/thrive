"""A domain-level context for calls that are made."""

from dataclasses import dataclass

from jupiter.framework_new.base.timestamp import Timestamp


@dataclass(frozen=True)
class DomainContext:
    """A domain-level context for calls that are made."""

    event_source: str
    action_timestamp: Timestamp

    @staticmethod
    def from_app(
        event_source: str,
        action_timestamp: Timestamp,
    ) -> "DomainContext":
        """Create a domain context from an app."""
        if len(event_source) == 0:
            raise Exception("Invalid event")
        return DomainContext(
            event_source=event_source,
            action_timestamp=action_timestamp,
        )
